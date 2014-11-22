SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `szekelytermelok`
--

CREATE DATABASE IF NOT EXISTS `szekelytermelok`;
USE `szekelytermelok`;

--
-- Jeloles: KK = kulso kulcs
--

--
-- Table structures
--

-- Szemelyek(SZ_ID, Nev, Cim, Tel, Email, Jelszo, Admin, Termelo, Megrendelo)
CREATE TABLE IF NOT EXISTS `Szemelyek`(
	`SZ_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Tel` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Jelszo` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
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
	`Ar` int NOT NULL,
	`Min_rendelesi_menny` int NOT NULL,
	`Kep` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Keszlet_menny` int(11) NOT NULL,
	`ME_ID` int references Mertekegysegek(ME_ID),
	`K_ID` int references Kategoriak(K_ID),
	`P_ID` int references Penznemek(P_ID),
	`SZ_ID` int references Szemelyek(SZ_ID),
	PRIMARY KEY(`T_ID`)
);

-- Vasarlok(SZ_ID[KK], Nev, Cim, Tel, Email, Jelszo, Szall_cim) ; Vasarlok -> "az_egy" -> Szemelyek
CREATE TABLE IF NOT EXISTS `Vasarlok`(
	`SZ_ID` int references Szemelyek(SZ_ID),
	`Szall_cim` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`SZ_ID`)
);

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
	`Szall_cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Statusz` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Datum` date,
	`T_ID` int references Termekek(T_ID),
	`Rendelo_ID` int references Szemelyek(SZ_ID),
	PRIMARY KEY(`M_ID`)
);

-- Promociok(T_ID[KK], Ar, Periodus_k, Periodus_v)
CREATE TABLE IF NOT EXISTS `Promociok`(
	`T_ID` int references Termekek(T_ID),
	`Ar` int NOT NULL,
	`Periodus_k` date,
	`Periodus_v` date,
	PRIMARY KEY(`T_ID`)
);


--
-- Dumping datas for tables
--

INSERT INTO `Szemelyek` (`SZ_ID`, `Nev`, `Cim`, `Tel`, `Email`, `Jelszo`, `Admin`, `Termelo`, `Megrendelo`) VALUES
(1, 'Toth Pal', 'Kezdiszentlelek, Patko utca 5.', '0722568945', 'tothpali@gmail.com', 'pali', 0, 0, 1),
(2, 'Sarga Maria', 'Szekelykeresztur, Teto utca 45', '0745035255', 'marineni@gmail.com', '123', 0, 1, 0),
(3, 'Szeles Sara', 'Csikszereda, Sugarut 19', '0748569854', 'sarineni@gmail.com', '1', 0, 1, 1);

INSERT INTO `Mertekegysegek` (`ME_ID`, `Nev`) VALUES
(1, 'g'),
(2, 'db'),
(3, 'csomag');

INSERT INTO `Kategoriak` (`K_ID`, `Nev`) VALUES
(1, 'tejtermek'),
(2, 'laska');

INSERT INTO `Penznemek` (`P_ID`, `Penznem`) VALUES
(1, 'RON'),
(2, 'EURO');

INSERT INTO `Termekek` (`T_ID`, `Nev`, `Leiras`, `Ar`, `Min_rendelesi_menny`, `Kep`, `Keszlet_menny`, `ME_ID`, `K_ID`, `P_ID`, `SZ_ID`) VALUES
(1, 'Hazi szeles laska', '3 tojasos', 5, 1, '', 10, 3, 2, 1, 2),
(2, 'Juhturo', 'Fiss es finom', 12, 1, '', 20, 2, 1, 1, 3);
