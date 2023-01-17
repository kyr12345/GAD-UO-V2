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
)