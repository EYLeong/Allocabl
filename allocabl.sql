-- MySQL dump 10.13  Distrib 8.0.19, for Linux (x86_64)
--
-- Host: localhost    Database: allocabl
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `allocabl`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `allocabl` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `allocabl`;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `id` varchar(24) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `available` tinyint(1) DEFAULT NULL,
  `customersServed` int DEFAULT NULL,
  `customerSocket` char(100) DEFAULT NULL,
  `online` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
INSERT INTO `agents` VALUES ('5e9464e335c8367f99ba3b28','sales',0,0,NULL,0),('5e94650035c8367f99ba3b31','sales',0,0,NULL,0),('5e94650735c8367f99ba3b3a','sales',0,0,NULL,0),('5e94650f35c8367f99ba3b43','sales',0,0,NULL,0),('5e94651635c8367f99ba3b4c','sales',0,0,NULL,0),('5e94652d35c8367f99ba3b55','finance',0,0,NULL,0),('5e94653535c8367f99ba3b5e','finance',0,0,NULL,0),('5e94653a35c8367f99ba3b67','finance',0,0,NULL,0),('5e94654135c8367f99ba3b70','finance',0,0,NULL,0),('5e94654635c8367f99ba3b79','finance',0,0,NULL,0),('5e94655535c8367f99ba3b82','general',0,0,NULL,0),('5e94655b35c8367f99ba3b8b','general',0,0,NULL,0),('5e94656335c8367f99ba3b94','general',0,0,NULL,0),('5e94656a35c8367f99ba3b9d','general',0,0,NULL,0),('5e94657135c8367f99ba3ba6','general',0,0,NULL,0);
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waitlist_finance`
--

DROP TABLE IF EXISTS `waitlist_finance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waitlist_finance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `socket_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waitlist_finance`
--

LOCK TABLES `waitlist_finance` WRITE;
/*!40000 ALTER TABLE `waitlist_finance` DISABLE KEYS */;
/*!40000 ALTER TABLE `waitlist_finance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waitlist_general`
--

DROP TABLE IF EXISTS `waitlist_general`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waitlist_general` (
  `id` int NOT NULL AUTO_INCREMENT,
  `socket_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waitlist_general`
--

LOCK TABLES `waitlist_general` WRITE;
/*!40000 ALTER TABLE `waitlist_general` DISABLE KEYS */;
/*!40000 ALTER TABLE `waitlist_general` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waitlist_sales`
--

DROP TABLE IF EXISTS `waitlist_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waitlist_sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `socket_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waitlist_sales`
--

LOCK TABLES `waitlist_sales` WRITE;
/*!40000 ALTER TABLE `waitlist_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `waitlist_sales` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-13 23:44:00
