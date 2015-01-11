<<<<<<< HEAD
﻿SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
=======
-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2015 at 12:48 AM
-- Server version: 5.5.39
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe

--
-- Database: `szekelytermelok`
--

<<<<<<< HEAD
CREATE DATABASE IF NOT EXISTS `szekelytermelok`;
USE `szekelytermelok`;
=======
-- --------------------------------------------------------

--
-- Table structure for table `kategoriak`
--

CREATE TABLE IF NOT EXISTS `kategoriak` (
`K_ID` int(11) NOT NULL,
  `Nev` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `kategoriak`
--

INSERT INTO `kategoriak` (`K_ID`, `Nev`) VALUES
(1, 'tejtermék'),
(2, 'laska'),
(3, 'lekvár');

-- --------------------------------------------------------
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe

--
-- Jeloles: KK = kulso kulcs
--

<<<<<<< HEAD
=======
CREATE TABLE IF NOT EXISTS `kiszallitasi_helyek` (
`KiszallHely_ID` int(11) NOT NULL,
  `SZ_ID` int(11) DEFAULT NULL,
  `Telep_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe
--
-- Table structures
--

<<<<<<< HEAD
-- Szemelyek(SZ_ID, Nev, Cim, Tel, Email, Jelszo, Admin, Termelo, Megrendelo)
CREATE TABLE IF NOT EXISTS `Szemelyek`(
	`SZ_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Tel` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Jelszo` varchar(40) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Admin` int(11) NOT NULL,
	`Termelo` int(11) NOT NULL,
	`Megrendelo` int(11) NOT NULL,
	PRIMARY KEY (`SZ_ID`)
) ;

-- Termelok(SZ_ID[KK], Nev, Cim, Tel, Email, Jelszo, Kep, Kiszallitasi_dij, Min_vasarloi_kosar, R_ID[KK]) ; Termelok -> "az_egy" -> Szemelyek
CREATE TABLE IF NOT EXISTS `Termelok`(
	`SZ_ID` int references Szemelyek(SZ_ID),
	`Kep` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci,
	`Kiszallitasi_dij` int,
	`Min_vasarloi_kosar` int,
	`R_ID` int references Rendszeresseg(R_ID),
	`P_ID` int references Penznemek(P_ID),
	PRIMARY KEY (`SZ_ID`)
) ;

-- Napok(N_ID, Nev)
CREATE TABLE IF NOT EXISTS `Napok`(
	`N_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(10) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY (`N_ID`)
);

-- Telepulesek(Telep_ID, Nev)
CREATE TABLE IF NOT EXISTS `Telepulesek`(
	`Telep_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY (`Telep_ID`)
);

-- Kiszallitasi_napok(KiszallNap_ID, SZ_ID[KK], N_ID[KK])
CREATE TABLE IF NOT EXISTS `Kiszallitasi_napok`(
	`KiszallNap_ID` int(11) NOT NULL AUTO_INCREMENT,
	`SZ_ID` int references Szemelyek(SZ_ID),
	`N_ID` int references Napok(N_ID),
	PRIMARY KEY (`KiszallNap_ID`)
);

-- Kiszallitasi_helyek(KiszallHely_ID, SZ_ID[KK], Telep_ID[KK])
CREATE TABLE IF NOT EXISTS `Kiszallitasi_helyek`(
	`KiszallHely_ID` int(11) NOT NULL AUTO_INCREMENT,
	`SZ_ID` int references Szemelyek(SZ_ID),
	`Telep_ID` int references Telepulesek(Telep_ID),
	PRIMARY KEY(`KiszallHely_ID`)
);

-- Rendszeresseg(R_ID, Nev)
CREATE TABLE IF NOT EXISTS `Rendszeresseg`(
	`R_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`R_ID`)
);
=======
CREATE TABLE IF NOT EXISTS `kiszallitasi_napok` (
`KiszallNap_ID` int(11) NOT NULL,
  `SZ_ID` int(11) DEFAULT NULL,
  `N_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kosarak`
--

CREATE TABLE IF NOT EXISTS `kosarak` (
`K_ID` int(11) NOT NULL,
  `T_ID` int(11) NOT NULL COMMENT 'termek',
  `SZ_ID` int(11) NOT NULL COMMENT 'megrendelo',
  `Mennyiseg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe

-- Mertekegysegek(ME_ID, Nev)
CREATE TABLE IF NOT EXISTS `Mertekegysegek`(
	`ME_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`ME_ID`)
);

-- Kategoriak(K_ID, Nev)
CREATE TABLE IF NOT EXISTS Kategoriak(
	`K_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`K_ID`)
);

-- Penznemek(P_ID,Nev)
CREATE TABLE IF NOT EXISTS `Penznemek`(
	`P_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Penznem` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`P_ID`)
);

-- Termekek(T_ID, Nev, Leiras, Ar, Min_rendelesi_menny, Kep, Keszlet_menny, ME_ID[KK], K_ID[KK], P_ID[KK], SZ_ID[KK])
CREATE TABLE IF NOT EXISTS `Termekek`(
	`T_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Leiras` varchar(300) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Ar` float NOT NULL,
	`Min_rendelesi_menny` int NOT NULL,
	`Kep` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci,
	`Keszlet_menny` int(11) NOT NULL,
	`ME_ID` int references Mertekegysegek(ME_ID),
	`K_ID` int references Kategoriak(K_ID),
	`SZ_ID` int references Szemelyek(SZ_ID),
	PRIMARY KEY(`T_ID`)
);

-- Vasarlok(SZ_ID[KK], Nev, Cim, Tel, Email, Jelszo, Szall_cim) ; Vasarlok -> "az_egy" -> Szemelyek
CREATE TABLE IF NOT EXISTS `Vasarlok`(
	`SZ_ID` int references Szemelyek(SZ_ID),
	`Szall_cim` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`SZ_ID`)
);

-- Kosarak(K_ID, T_ID, SZ_ID, Mennyiseg)
CREATE TABLE IF NOT EXISTS `Kosarak` (
	`K_ID` int(11) NOT NULL AUTO_INCREMENT,
	`T_ID` int references Termekek(T_ID),
	`SZ_ID` int references Szemelyek(SZ_ID),
	`Mennyiseg` int(11) NOT NULL,
	PRIMARY KEY(`K_ID`)
);

<<<<<<< HEAD
-- Uzenetek(U_ID, Szoveg, Datum, Felado_ID[KK], Cimzett_ID[KK])
CREATE TABLE IF NOT EXISTS `Uzenetek`(
	`U_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Szoveg` varchar(1000) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Datum` date,
	`Felado_ID` int references Szemelyek(SZ_ID),
	`Cimzett_ID` int references Szemelyek(SZ_ID),
	PRIMARY KEY(`U_ID`)
);

-- Megrendelesek(M_ID, Mennyiseg, Szall_cim, Statusz, Datum, T_ID[KK], Rendelo_ID[KK])
CREATE TABLE IF NOT EXISTS `Megrendelesek`(
	`M_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Mennyiseg` int(11) NOT NULL,
	`ST_ID` int(11) NOT NULL,
	`Datum` date DEFAULT NULL,
	`Ar` float NOT NULL,
	`T_ID` int references Termekek(T_ID),
	`Rendelo_ID` int references Szemelyek(SZ_ID),
	PRIMARY KEY(`M_ID`)
);

-- Statuszok(ST_ID, Nev)
CREATE TABLE IF NOT EXISTS `Statuszok`(
	`ST_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`ST_ID`)
);

-- Promociok(T_ID[KK], Ar, Periodus_k, Periodus_v)
CREATE TABLE IF NOT EXISTS `Promociok`(
	`T_ID` int references Termekek(T_ID),
	`Ar` float NOT NULL,
	`Periodus_k` date,
	`Periodus_v` date,
	PRIMARY KEY(`T_ID`)
);
=======
CREATE TABLE IF NOT EXISTS `megrendelesek` (
`M_ID` int(11) NOT NULL,
  `Mennyiseg` int(11) NOT NULL,
  `Statusz` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Datum` date DEFAULT NULL,
  `Ar` float NOT NULL COMMENT 'Egysegnyi mennyiseg ara',
  `T_ID` int(11) DEFAULT NULL,
  `Rendelo_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `megrendelesek`
--

INSERT INTO `megrendelesek` (`M_ID`, `Mennyiseg`, `Statusz`, `Datum`, `Ar`, `T_ID`, `Rendelo_ID`) VALUES
(3, 3, 'Új rendelés', '2014-12-31', 4, 1, 3),
(4, 1, 'Új rendelés', '2014-12-31', 2, 4, 3),
(5, 2, 'Új rendelés', '2014-12-31', 3, 2, 3),
(6, 2, 'Új rendelés', '2014-12-31', 7, 7, 3),
(7, 1, 'Új rendelés', '2014-12-31', 8, 3, 3),
(8, 1, 'Új rendelés', '2014-12-31', 2, 4, 3),
(9, 2, 'Új rendelés', '2015-01-03', 4, 1, 3),
(10, 3, 'Új rendelés', '2015-01-03', 2, 4, 3),
(11, 1, 'Új rendelés', '2015-01-03', 9, 7, 3),
(15, 2, 'Új rendelés', '2015-01-06', 4, 1, 3),
(16, 2, 'Új rendelés', '2015-01-06', 8, 7, 3),
(17, 1, 'Új rendelés', '2015-01-06', 3, 2, 3),
(18, 1, 'Új rendelés', '2015-01-06', 2, 4, 3);
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe


--
-- Dumping datas for tables
--

<<<<<<< HEAD
INSERT INTO `Szemelyek` (`SZ_ID`, `Nev`, `Cim`, `Tel`, `Email`, `Jelszo`, `Admin`, `Termelo`, `Megrendelo`) VALUES
(1, 'Tóth Pál', 'Kézdiszentlélek, Patkó utca 5.', '0722568945', 'tothpali@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 0, 1),
(2, 'Sárga Mária', 'Székelykeresztúr, Tető utca 45', '0745035255', 'marineni@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 1, 0),
(3, 'Széles Sára', 'Csíkszereda, Sugárút 19', '0748569854', 'sarineni@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 1, 1);
=======
CREATE TABLE IF NOT EXISTS `mertekegysegek` (
`ME_ID` int(11) NOT NULL,
  `Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe

INSERT INTO `Termelok` (`SZ_ID`, `Kep`, `Kiszallitasi_dij`, `Min_vasarloi_kosar`, `R_ID`, `P_ID`) VALUES
(2, 'logo2.jpg',15, 30, 1, 1),
(3, 'logo3.jpg',12, 50, 3, 2);

INSERT INTO `Mertekegysegek` (`ME_ID`, `Nev`) VALUES
(1, 'g'),
(2, 'darab'),
(3, 'csomag'),
(4, 'kg'),
(5, 'dkg'),
(6, 'borkán'),
(7, 'liter');

INSERT INTO `Kategoriak` (`K_ID`, `Nev`) VALUES
(1, 'tejtermek'),
(2, 'laska'),
(3, 'lekvár');

INSERT INTO `Penznemek` (`P_ID`, `Penznem`) VALUES
(1, 'RON'),
(2, 'EURO');

<<<<<<< HEAD
INSERT INTO `Termekek` (`T_ID`, `Nev`, `Leiras`, `Ar`, `Min_rendelesi_menny`, `Kep`, `Keszlet_menny`, `ME_ID`, `K_ID`, `SZ_ID`) VALUES
(1, 'Házi széles laska', '3 tojásos', 5, 1, 'termek1.jpg', 4, 3, 2, 2),
(2, 'Juhsajt', 'Friss és finom', 3, 1, 'termek2.jpg', 2, 2, 1, 3),
(3, 'Tehéntúró', 'Félzsíros', 8, 1, 'termek3.jpg', 9, 5, 1, 2),
(4, 'Kecskesajt', 'Igazi', 2, 1, 'termek4.jpg', 8, 5, 1, 2),
(5, 'Szilvalekvár', 'Édes, finom', 5, 1, 'termek5.jpg', 0, 6, 3, 3),
(7, 'Tehéntúró', 'Mindig friss és krémes', 9, 1, 'termek7.jpg', 11, 5, 1, 3);
=======
CREATE TABLE IF NOT EXISTS `napok` (
`N_ID` int(11) NOT NULL,
  `Nev` varchar(10) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe

INSERT INTO `Promociok` (`T_ID`, `Ar`, `Periodus_k`, `Periodus_v`) VALUES
(1, 4, '2014-12-28', '2015-01-14'),
(7, 8, '2015-01-01', '2015-01-30');

INSERT INTO `Napok` (`N_ID`, `Nev`) VALUES 
(1, 'Hétfo'),
(2, 'Kedd'),
(3, 'Szerda'),
(4, 'Csütörtök'),
(5, 'Péntek'),
(6, 'Szombat'),
(7, 'Vasárnap');

<<<<<<< HEAD
INSERT INTO `Rendszeresseg` (`R_ID`, `Nev`) VALUES 
=======
-- --------------------------------------------------------

--
-- Table structure for table `penznemek`
--

CREATE TABLE IF NOT EXISTS `penznemek` (
`P_ID` int(11) NOT NULL,
  `Penznem` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `penznemek`
--

INSERT INTO `penznemek` (`P_ID`, `Penznem`) VALUES
(1, 'RON'),
(2, 'EURO');

-- --------------------------------------------------------

--
-- Table structure for table `promociok`
--

CREATE TABLE IF NOT EXISTS `promociok` (
  `T_ID` int(11) NOT NULL DEFAULT '0',
  `Ar` int(11) NOT NULL,
  `Periodus_k` date DEFAULT NULL,
  `Periodus_v` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `promociok`
--

INSERT INTO `promociok` (`T_ID`, `Ar`, `Periodus_k`, `Periodus_v`) VALUES
(1, 4, '2014-12-28', '2015-01-04'),
(7, 8, '2014-12-17', '2014-12-18');

-- --------------------------------------------------------

--
-- Table structure for table `rendszeresseg`
--

CREATE TABLE IF NOT EXISTS `rendszeresseg` (
`R_ID` int(11) NOT NULL,
  `Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `rendszeresseg`
--

INSERT INTO `rendszeresseg` (`R_ID`, `Nev`) VALUES
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe
(1, 'Hetente'),
(2, 'Kéthetente'),
(3, 'Háromhetente'),
(4, 'Havonta'),
(5, 'Kéthavonta'),
(6, 'Háromhavonta');

<<<<<<< HEAD
INSERT INTO `Telepulesek` (`Telep_ID`, `Nev`) VALUES 
=======
-- --------------------------------------------------------

--
-- Table structure for table `szemelyek`
--

CREATE TABLE IF NOT EXISTS `szemelyek` (
`SZ_ID` int(11) NOT NULL,
  `Nev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Tel` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Jelszo` varchar(40) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Admin` int(11) NOT NULL,
  `Termelo` int(11) NOT NULL,
  `Megrendelo` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `szemelyek`
--

INSERT INTO `szemelyek` (`SZ_ID`, `Nev`, `Cim`, `Tel`, `Email`, `Jelszo`, `Admin`, `Termelo`, `Megrendelo`) VALUES
(1, 'Tóth Pál', 'Kézdiszentlélek, Patkó utca 5.', '0722568945', 'tothpali@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 0, 1),
(2, 'Sárga Mária', 'Székelykeresztúr, Tető utca 45', '0745035255', 'marineni@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 1, 0),
(3, 'Széles Sára', 'Kézdivásárhely, Sugárút 19', '0748569854', 'sarineni@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `telepulesek`
--

CREATE TABLE IF NOT EXISTS `telepulesek` (
`Telep_ID` int(11) NOT NULL,
  `Nev` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `telepulesek`
--

INSERT INTO `telepulesek` (`Telep_ID`, `Nev`) VALUES
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe
(1, 'Kolozsvár'),
(2, 'Gyergyócsomafalva'),
(3, 'Sepsiszentgyörgy'),
(4, 'Székelyudvarhely'),
(5, 'Vásárhely'),
(6, 'Csíkszereda');

<<<<<<< HEAD
INSERT INTO `Megrendelesek` (`M_ID`, `Mennyiseg`, `ST_ID`, `Datum`, `Ar`, `T_ID`, `Rendelo_ID`) VALUES
(3, 3, 1, '2014-12-31', 4, 1, 3),
(4, 1, 1, '2014-12-31', 2, 4, 3),
(5, 2, 1, '2014-12-31', 3, 2, 3),
(6, 2, 1, '2014-12-31', 7, 7, 3),
(7, 1, 1, '2014-12-31', 8, 3, 3),
(8, 1, 1, '2014-12-31', 2, 4, 3);

INSERT INTO `Statuszok` (`ST_ID`, `Nev`) VALUES
(1, 'Új rendelés'),
(2, 'Függőben van'),
(3, 'Kiszállítva'),
(4, 'Visszautastva');
=======
-- --------------------------------------------------------

--
-- Table structure for table `termekek`
--

CREATE TABLE IF NOT EXISTS `termekek` (
`T_ID` int(11) NOT NULL,
  `Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Leiras` varchar(300) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Ar` int(11) NOT NULL,
  `Min_rendelesi_menny` int(11) NOT NULL,
  `Kep` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `Keszlet_menny` int(11) NOT NULL,
  `ME_ID` int(11) DEFAULT NULL COMMENT 'MertekegysegID',
  `K_ID` int(11) DEFAULT NULL COMMENT 'KategoriaID',
  `P_ID` int(11) DEFAULT NULL COMMENT 'penznemID',
  `SZ_ID` int(11) DEFAULT NULL COMMENT 'SzemelyID(termeloID)'
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `termekek`
--

INSERT INTO `termekek` (`T_ID`, `Nev`, `Leiras`, `Ar`, `Min_rendelesi_menny`, `Kep`, `Keszlet_menny`, `ME_ID`, `K_ID`, `P_ID`, `SZ_ID`) VALUES
(1, 'Házi széles laska', '3 tojásos', 5, 1, 'termek1.jpg', 4, 3, 2, 1, 2),
(2, 'Juhsajt', 'Friss és finom', 3, 1, 'termek2.jpg', 2, 2, 1, 2, 3),
(3, 'Tehéntúró', 'Félzsíros', 8, 1, 'termek3.jpg', 9, 5, 1, 1, 2),
(4, 'Kecskesajt', 'Igazi', 2, 1, 'termek4.jpg', 8, 5, 1, 2, 2),
(5, 'Szilvalekvár', 'Édes, finom', 5, 1, 'termek5.jpg', 0, 6, 3, 1, 3),
(7, 'Tehéntúró', 'Mindig friss és krémes', 9, 1, 'termek7.jpg', 11, 5, 1, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `termelok`
--

CREATE TABLE IF NOT EXISTS `termelok` (
  `SZ_ID` int(11) NOT NULL DEFAULT '0',
  `Kep` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `Kiszallitasi_dij` int(11) DEFAULT NULL,
  `Min_vasarloi_kosar` int(11) DEFAULT NULL,
  `R_ID` int(11) DEFAULT NULL,
  `P_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `termelok`
--

INSERT INTO `termelok` (`SZ_ID`, `Kep`, `Kiszallitasi_dij`, `Min_vasarloi_kosar`, `R_ID`, `P_ID`) VALUES
(2, 'logo2.jpg', 15, 30, 1, 1),
(3, 'logo3.jpg', 12, 50, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `uzenetek`
--

CREATE TABLE IF NOT EXISTS `uzenetek` (
`U_ID` int(11) NOT NULL,
  `Szoveg` varchar(1000) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `Datum` date DEFAULT NULL,
  `Felado_ID` int(11) DEFAULT NULL,
  `Cimzett_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kategoriak`
--
ALTER TABLE `kategoriak`
 ADD PRIMARY KEY (`K_ID`);

--
-- Indexes for table `kiszallitasi_helyek`
--
ALTER TABLE `kiszallitasi_helyek`
 ADD PRIMARY KEY (`KiszallHely_ID`);

--
-- Indexes for table `kiszallitasi_napok`
--
ALTER TABLE `kiszallitasi_napok`
 ADD PRIMARY KEY (`KiszallNap_ID`);

--
-- Indexes for table `kosarak`
--
ALTER TABLE `kosarak`
 ADD PRIMARY KEY (`K_ID`);

--
-- Indexes for table `megrendelesek`
--
ALTER TABLE `megrendelesek`
 ADD PRIMARY KEY (`M_ID`);

--
-- Indexes for table `mertekegysegek`
--
ALTER TABLE `mertekegysegek`
 ADD PRIMARY KEY (`ME_ID`);

--
-- Indexes for table `napok`
--
ALTER TABLE `napok`
 ADD PRIMARY KEY (`N_ID`);

--
-- Indexes for table `penznemek`
--
ALTER TABLE `penznemek`
 ADD PRIMARY KEY (`P_ID`);

--
-- Indexes for table `promociok`
--
ALTER TABLE `promociok`
 ADD PRIMARY KEY (`T_ID`);

--
-- Indexes for table `rendszeresseg`
--
ALTER TABLE `rendszeresseg`
 ADD PRIMARY KEY (`R_ID`);

--
-- Indexes for table `szemelyek`
--
ALTER TABLE `szemelyek`
 ADD PRIMARY KEY (`SZ_ID`);

--
-- Indexes for table `telepulesek`
--
ALTER TABLE `telepulesek`
 ADD PRIMARY KEY (`Telep_ID`);

--
-- Indexes for table `termekek`
--
ALTER TABLE `termekek`
 ADD PRIMARY KEY (`T_ID`);

--
-- Indexes for table `termelok`
--
ALTER TABLE `termelok`
 ADD PRIMARY KEY (`SZ_ID`);

--
-- Indexes for table `uzenetek`
--
ALTER TABLE `uzenetek`
 ADD PRIMARY KEY (`U_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategoriak`
--
ALTER TABLE `kategoriak`
MODIFY `K_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `kiszallitasi_helyek`
--
ALTER TABLE `kiszallitasi_helyek`
MODIFY `KiszallHely_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `kiszallitasi_napok`
--
ALTER TABLE `kiszallitasi_napok`
MODIFY `KiszallNap_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `kosarak`
--
ALTER TABLE `kosarak`
MODIFY `K_ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `megrendelesek`
--
ALTER TABLE `megrendelesek`
MODIFY `M_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `mertekegysegek`
--
ALTER TABLE `mertekegysegek`
MODIFY `ME_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `napok`
--
ALTER TABLE `napok`
MODIFY `N_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `penznemek`
--
ALTER TABLE `penznemek`
MODIFY `P_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `rendszeresseg`
--
ALTER TABLE `rendszeresseg`
MODIFY `R_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `szemelyek`
--
ALTER TABLE `szemelyek`
MODIFY `SZ_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `telepulesek`
--
ALTER TABLE `telepulesek`
MODIFY `Telep_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `termekek`
--
ALTER TABLE `termekek`
MODIFY `T_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `uzenetek`
--
ALTER TABLE `uzenetek`
MODIFY `U_ID` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
>>>>>>> d4e31f0dfc03846e8baf3eee61e2571c583b2dbe
