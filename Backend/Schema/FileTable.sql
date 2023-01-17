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
  `DEADLINE` DATE NOT NULL,
  `fileno` varchar(255) NOT NULL,
  PRIMARY KEY (`FID`)
)