import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from email_utils import send_email
from email_utils import send_alert

# List of topics to subscribe to
KAFKA_TOPICS = ["notification-topic", "appointment-topic", "record-topic"]

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="🔹 [%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

async def consume():
    consumer = AIOKafkaConsumer(
        *KAFKA_TOPICS,
        bootstrap_servers='localhost:9092',
        group_id="email-group"
    )
    await consumer.start()
    logging.info(f"✅ Kafka consumer started and listening to topics: {', '.join(KAFKA_TOPICS)}")

    try:
        async for msg in consumer:
            topic = msg.topic
            value = msg.value.decode("utf-8")
            logging.info(f"📨 Received message from '{topic}': {value}")

            try:
                data = json.loads(value)
                await send_email(data["to"], data["subject"], data["body"])
                logging.info(f"✅ Email sent to {data['to']} via topic '{topic}'")

            except Exception as e:
                error_message = f"❌ Failed to process message from '{topic}': {e}"
                logging.error(error_message)

                # Send alert to yourself
                await send_alert("pamoj.22@cse.mrt.ac.lk", error_message)

    finally:
        await consumer.stop()
        logging.info("Kafka consumer stopped.")
