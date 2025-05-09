# import asyncio
# from kafka_consumer import consume

# if __name__ == "__main__":
#     asyncio.run(consume())


# from fastapi import FastAPI
# import asyncio
# import logging
# from kafka_consumer import consume

# app = FastAPI()

# @app.on_event("startup")
# async def start_kafka_consumer():
#     while True:
#         try:
#             logging.info("🔄 Trying to connect to Kafka...")
#             await asyncio.create_task(consume())
#             break
#         except Exception as e:
#             logging.error(f"❌ Kafka not ready: {e}")
#             await asyncio.sleep(5)

# @app.get("/")
# def health_check():
#     return {"status": "FastAPI is up"}


# from fastapi import FastAPI
# import asyncio
# import logging
# from contextlib import asynccontextmanager
# from kafka_consumer import consume

# logging.basicConfig(level=logging.INFO)

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     while True:
#         try:
#             logging.info("🔄 Trying to connect to Kafka...")
#             asyncio.create_task(consume())
#             break
#         except Exception as e:
#             logging.error(f"❌ Kafka not ready: {e}")
#             await asyncio.sleep(5)

#     yield  # FastAPI continues running here

#     # (Optional) shutdown/cleanup logic here

# app = FastAPI(lifespan=lifespan)

# @app.get("/")
# async def root():
#     return {"status": "FastAPI is running"}


from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio
import logging
from kafka_consumer import consume

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("📦 FastAPI starting up...")

    async def kafka_task():
        while True:
            try:
                logging.info("🔄 Trying to connect to Kafka...")
                await consume()
                break
            except Exception as e:
                logging.error(f"❌ Kafka not ready: {e}")
                await asyncio.sleep(5)

    asyncio.create_task(kafka_task())

    yield  # ⬅️ FastAPI runs after this point

    logging.info("🧹 FastAPI shutting down...")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"status": "FastAPI running and retrying Kafka if needed."}
