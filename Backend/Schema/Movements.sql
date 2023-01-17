CREATE TABLE `movements` (
  `MID` int NOT NULL AUTO_INCREMENT,
  `FID` int NOT NULL,
  `UO` varchar(255) NOT NULL,
  `MOVTO` varchar(255) NOT NULL,
  `MOVTDATE` date NOT NULL,
  `Remarks` varchar(255) NOT NULL,
  `User` varchar(255) NOT NULL,
  `date_time` date NOT NULL,
  `CONFIRMATION` varchar(50) default "NO",
  PRIMARY KEY (`MID`),
  FOREIGN KEY (`FID`) REFERENCES `filetables` (`FID`)
)