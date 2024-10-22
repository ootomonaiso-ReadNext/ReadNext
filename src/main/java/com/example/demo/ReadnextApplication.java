package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.demo.model.jpa")  // JPAエンティティのパッケージを指定
@EnableJpaRepositories(basePackages = "com.example.demo.repository.jpa")  // JPAリポジトリのパッケージを指定
@EnableMongoRepositories(basePackages = "com.example.demo.repository.mongo")  // MongoDBリポジトリのパッケージを指定
public class ReadnextApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReadnextApplication.class, args);
    }
}
