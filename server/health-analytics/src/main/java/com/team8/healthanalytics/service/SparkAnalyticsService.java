package com.team8.healthanalytics.service;

import com.team8.healthanalytics.model.PatientRecord;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SparkAnalyticsService {
    public long countHighRiskPatients(List<PatientRecord> records) {
        SparkSession spark = SparkSession.builder()
                .appName("HealthAnalyticsSparkApp")
                .master("local[*]")
                .getOrCreate();
        JavaSparkContext sc = new JavaSparkContext(spark.sparkContext());
        JavaRDD<PatientRecord> rdd = sc.parallelize(records);
        long count = rdd.filter(record -> {
            for (String lbf : record.getLbfData()) {
                if (lbf.startsWith("LBF103")) {
                    String[] parts = lbf.split(":");
                    if (parts.length == 2 && parts[1].contains("/")) {
                        String[] bp = parts[1].split("/");
                        try {
                            int systolic = Integer.parseInt(bp[0]);
                            int diastolic = Integer.parseInt(bp[1]);
                            if (systolic >= 140 || diastolic >= 90) {
                                return true;
                            }
                        } catch (NumberFormatException ignored) {}
                    }
                }
            }
            return false;
        }).count();
        sc.close();
        spark.close();
        return count;
    }
}
