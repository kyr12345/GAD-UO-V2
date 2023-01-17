CREATE DATABASE  IF NOT EXISTS `uo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `uo`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: uo
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accused`
--

DROP TABLE IF EXISTS `accused`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accused` (
  `AID` int NOT NULL AUTO_INCREMENT,
  `SATHI` varchar(255) NOT NULL,
  `CPF` varchar(255) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `DOR` varchar(255) NOT NULL,
  `USER` varchar(255) NOT NULL,
  `DATE_TIME` date NOT NULL,
  PRIMARY KEY (`AID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accused`
--

LOCK TABLES `accused` WRITE;
/*!40000 ALTER TABLE `accused` DISABLE KEYS */;
INSERT INTO `accused` VALUES (12,'sdasdasd','asasdsd','sddfsdf','2022-12-09','kyr1234','2022-12-23'),(13,'ssdfd','sddfsdf','sdfsd','2022-12-09','kyr1234','2022-12-23');
/*!40000 ALTER TABLE `accused` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accused_designation`
--

DROP TABLE IF EXISTS `accused_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accused_designation` (
  `DID` int NOT NULL AUTO_INCREMENT,
  `DESIGNATION` varchar(255) NOT NULL,
  `USER` varchar(255) NOT NULL,
  `FID` int NOT NULL,
  `AID` int NOT NULL,
  `DATE_TIME` date NOT NULL,
  `CLASS` int NOT NULL,
  `CUC` varchar(255) NOT NULL,
  PRIMARY KEY (`DID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accused_designation`
--

LOCK TABLES `accused_designation` WRITE;
/*!40000 ALTER TABLE `accused_designation` DISABLE KEYS */;
INSERT INTO `accused_designation` VALUES (11,'sdsdfdsf','kyr1234',15,12,'2022-12-23',1,'Yes'),(12,'ssdsdsdf','kyr1234',16,13,'2022-12-23',1,'Yes');
/*!40000 ALTER TABLE `accused_designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allocation`
--

DROP TABLE IF EXISTS `allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allocation` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ALLOCATED` varchar(255) NOT NULL,
  `COUNT` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocation`
--

LOCK TABLES `allocation` WRITE;
/*!40000 ALTER TABLE `allocation` DISABLE KEYS */;
INSERT INTO `allocation` VALUES (17,'SO-1',2),(18,'SO-2',1),(19,'SO-3',0),(20,'SO-4',5),(21,'DYSO-1',0),(22,'DYSO-2',0),(23,'US-1',10),(24,'US-2',8);
/*!40000 ALTER TABLE `allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filetables`
--

DROP TABLE IF EXISTS `filetables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filetables` (
  `FID` int NOT NULL AUTO_INCREMENT,
  `eSarkar` varchar(255) NOT NULL,
  `Department` varchar(255) NOT NULL,
  `Sub` varchar(255) NOT NULL,
  `FType` varchar(255) NOT NULL,
  `Stage` varchar(255) NOT NULL,
  `Allot` varchar(255) NOT NULL,
  `DATE_TIME` date DEFAULT NULL,
  `USER` varchar(255) NOT NULL,
  `UO` varchar(255) NOT NULL,
  `fileno` varchar(255) NOT NULL,
  PRIMARY KEY (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filetables`
--

LOCK TABLES `filetables` WRITE;
/*!40000 ALTER TABLE `filetables` DISABLE KEYS */;
INSERT INTO `filetables` VALUES (15,'sdsadasd','Climate Change Department','ssdasdad','Suspension','Deemed + Continue Suspension','SO-1','2022-12-23','kyr1234','1/2022','sdadasdsdfsd'),(16,'dsfdsfsd','Food & Civil Supplies Department','dfdsfsdf','Suspension',' DE Suspension','SO-2','2022-12-23','kyr1234','2/2022','dssdfsd');
/*!40000 ALTER TABLE `filetables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movements`
--

DROP TABLE IF EXISTS `movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements` (
  `MID` int NOT NULL AUTO_INCREMENT,
  `FID` int NOT NULL,
  `UO` varchar(255) NOT NULL,
  `MOVTO` varchar(255) NOT NULL,
  `MOVTDATE` date NOT NULL,
  `Remarks` varchar(255) NOT NULL,
  `User` varchar(255) NOT NULL,
  `date_time` date NOT NULL,
  PRIMARY KEY (`MID`),
  KEY `FID` (`FID`),
  CONSTRAINT `movements_ibfk_1` FOREIGN KEY (`FID`) REFERENCES `filetables` (`FID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements`
--

LOCK TABLES `movements` WRITE;
/*!40000 ALTER TABLE `movements` DISABLE KEYS */;
INSERT INTO `movements` VALUES (11,15,'1/2022','SO-1','2022-12-31','First Movement','kyr1234','2022-12-23'),(12,16,'2/2022','SO-2','2023-01-08','First Movement','kyr1234','2022-12-23');
/*!40000 ALTER TABLE `movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ROLE` varchar(255) DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yug','yugkhokhar18@gmail.com','kyr1234','$2a$10$n7Kd.ELu0QvRaz2acjR89uBFhLWqRHAnS0Wq.1nhfoQiEyKJwPFsS','Admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-23  2:07:49
