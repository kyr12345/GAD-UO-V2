CREATE DATABASE UCO;
use UCO;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ROLE` varchar(255) DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) 


/* 

mysql> describe movements;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| MID       | int          | NO   | PRI | NULL    | auto_increment |
| FID       | int          | NO   | MUL | NULL    |                |
| UO        | varchar(255) | NO   |     | NULL    |                |
| MOVTO     | varchar(255) | NO   |     | NULL    |                |
| MOVTDATE  | date         | NO   |     | NULL    |                |
| Remarks   | varchar(255) | NO   |     | NULL    |                |
| User      | varchar(255) | NO   |     | NULL    |                |
| date_time | date         | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+


mysql> describe filetables;
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| FID        | int          | NO   | PRI | NULL    | auto_increment |
| eSarkar    | varchar(255) | NO   |     | NULL    |                |
| Department | varchar(255) | NO   |     | NULL    |                |
| Sub        | varchar(255) | NO   |     | NULL    |                |
| FType      | varchar(255) | NO   |     | NULL    |                |
| Stage      | varchar(255) | NO   |     | NULL    |                |
| Allot      | varchar(255) | NO   |     | NULL    |                |
| DATE_TIME  | date         | YES  |     | NULL    |                |
| USER       | varchar(255) | NO   |     | NULL    |                |
| UO         | varchar(255) | NO   |     | NULL    |                |
| fileno     | varchar(255) | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
11 rows in set (0.04 sec)

mysql> describe accused;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| AID       | int          | NO   | PRI | NULL    | auto_increment |
| SATHI     | varchar(255) | NO   |     | NULL    |                |
| CPF       | varchar(255) | NO   |     | NULL    |                |
| NAME      | varchar(255) | NO   |     | NULL    |                |
| DOR       | varchar(255) | NO   |     | NULL    |                |
| USER      | varchar(255) | NO   |     | NULL    |                |
| DATE_TIME | date         | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)

mysql> describe accused_designation;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| DID         | int          | NO   | PRI | NULL    | auto_increment |
| DESIGNATION | varchar(255) | NO   |     | NULL    |                |
| USER        | varchar(255) | NO   |     | NULL    |                |
| FID         | int          | NO   |     | NULL    |                |
| AID         | int          | NO   |     | NULL    |                |
| DATE_TIME   | date         | NO   |     | NULL    |                |
| CLASS       | int          | NO   |     | NULL    |                |
| CUC         | varchar(255) | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
8 rows in set (0.00 sec)

 */