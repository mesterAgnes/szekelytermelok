-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2014 at 09:06 PM
-- Server version: 5.5.39
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `szekelytermelok`
--


CREATE DATABASE IF NOT EXISTS `szekelytermelok`;
USE `szekelytermelok`;

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

--
-- Table structure for table `kiszallitasi_helyek`
--

CREATE TABLE IF NOT EXISTS `kiszallitasi_helyek` (
	`KiszallHely_ID` int(11) NOT NULL,
	`SZ_ID` int(11) DEFAULT NULL,
	`Telep_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kiszallitasi_napok`
--

CREATE TABLE IF NOT EXISTS `kiszallitasi_napok` (
	`KiszallNap_ID` int(11) NOT NULL,
	`SZ_ID` int(11) DEFAULT NULL,
	`N_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `megrendelesek`
--

CREATE TABLE IF NOT EXISTS `megrendelesek` (
	`M_ID` int(11) NOT NULL,
	`Mennyiseg` int(11) NOT NULL,
	`Statusz` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Datum` date DEFAULT NULL,
	`Ar` float NOT NULL COMMENT 'Egysegnyi mennyiseg ara',
	`T_ID` int(11) DEFAULT NULL,
	`Rendelo_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `megrendelesek`
--

INSERT INTO `megrendelesek` (`M_ID`, `Mennyiseg`, `Statusz`, `Datum`, `Ar`, `T_ID`, `Rendelo_ID`) VALUES
(1, 3, 'Új rendelés', '2014-12-31', 4, 1, 3),
(2, 1, 'Új rendelés', '2014-12-31', 2, 4, 3),
(3, 2, 'Új rendelés', '2014-12-31', 3, 2, 3),
(4, 2, 'Új rendelés', '2014-12-31', 7, 7, 3),
(5, 2, 'Új rendelés', '2015-01-03', 4, 1, 3),
(6, 3, 'Új rendelés', '2015-01-03', 2, 4, 3),
(7, 1, 'Új rendelés', '2015-01-03', 9, 7, 3);

-- --------------------------------------------------------

--
-- Table structure for table `mertekegysegek`
--

CREATE TABLE IF NOT EXISTS `mertekegysegek` (
	`ME_ID` int(11) NOT NULL,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `mertekegysegek`
--

INSERT INTO `mertekegysegek` (`ME_ID`, `Nev`) VALUES
(1, 'g'),
(2, 'darab'),
(3, 'csomag'),
(4, 'kg'),
(5, 'dkg'),
(6, 'borkán');

-- --------------------------------------------------------

--
-- Table structure for table `napok`
--

CREATE TABLE IF NOT EXISTS `napok` (
	`N_ID` int(11) NOT NULL,
	`Nev` varchar(10) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `napok`
--

INSERT INTO `napok` (`N_ID`, `Nev`) VALUES
(1, 'Hétfo'),
(2, 'Kedd'),
(3, 'Szerda'),
(4, 'Csütörtök'),
(5, 'Péntek'),
(6, 'Szombat'),
(7, 'Vasárnap');

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
(7, 7, '2014-12-17', '2014-12-18');

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
(1, 'Hetente'),
(2, 'Kéthetente'),
(3, 'Háromhetente'),
(4, 'Havonta'),
(5, 'Kéthavonta'),
(6, 'Háromhavonta');

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
(3, 'Széles Sára', 'Csíkszereda, Sugárút 19', '0748569854', 'sarineni@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 0, 1, 1);

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
(1, 'Kolozsvár'),
(2, 'Gyergyócsomafalva'),
(3, 'Sepsiszentgyörgy'),
(4, 'Székelyudvarhely'),
(5, 'Vásárhely'),
(6, 'Csíkszereda');

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
(1, 'Házi széles laska', '3 tojásos', 5, 1, 'termek1.jpg', 10, 3, 2, 1, 2),
(2, 'Juhsajt', 'Friss és finom', 3, 1, 'termek2.jpg', 2, 2, 1, 2, 3),
(3, 'Tehéntúró', 'Félzsíros', 8, 1, 'termek3.jpg', 15, 5, 1, 1, 2),
(4, 'Kecskesajt', 'Igazi', 2, 1, 'termek4.jpg', 3, 5, 1, 2, 2),
(5, 'Szilvalekvár', 'Édes, finom', 5, 1, 'termek5.jpg', 0, 6, 3, 1, 3),
(7, 'Tehéntúró', 'Mindig friss és krémes', 9, 1, 'termek7.jpg', 2, 5, 1, 1, 3);

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

-- --------------------------------------------------------

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
-- AUTO_INCREMENT for table `megrendelesek`
--
ALTER TABLE `megrendelesek`
MODIFY `M_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
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
