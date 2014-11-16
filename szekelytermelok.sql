SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `szekelytermelok`
--

CREATE DATABASE IF NOT EXISTS `szekelytermelok`;
USE `szekelytermelok`;

-- Termelok(T_ID, Nev, Cim, Tel, Email, Jelszo, Logo, Kiszallitasi_dij, Min_vasarloi_kosar)
CREATE TABLE IF NOT EXISTS `Termelok`(
	`T_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Tel` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Jelszo` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Logo` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci,
	`Kiszallitasi_dij` int,
	`Min_vasarloi_kosar` int,
	PRIMARY KEY (`T_ID`)
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

-- Kiszallitasi_napok(T_ID, N_ID)
CREATE TABLE IF NOT EXISTS `Kiszallitasi_napok`(
	`KiszallNap_ID` int(11) NOT NULL AUTO_INCREMENT,
	`T_ID` int references Termelok(T_ID),
	`N_ID` int references Napok(N_ID),
	PRIMARY KEY (`KiszallNap_ID`)
);

-- Kiszallitasi_helyek(T_ID, Telep_ID)
CREATE TABLE IF NOT EXISTS `Kiszallitasi_helyek`(
	`KiszallHely_ID` int(11) NOT NULL AUTO_INCREMENT,
	`T_ID` int references Termelok(T_ID),
	`Telep_ID` int references Telepulesek(Telep_ID),
	PRIMARY KEY(`KiszallHely_ID`)
);

-- Rendszeresseg(R_ID, Nev)
CREATE TABLE IF NOT EXISTS `Rendszeresseg`(
	`R_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`T_ID` int references Termelok(T_ID),
	PRIMARY KEY(`R_ID`)
);

-- Mertekegysegek(ME_ID,Nev)
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

-- Termekek(T_ID, Nev, Leiras, Ar, Min_rendelesi_menny, Foto, Keszlet_menny)
CREATE TABLE IF NOT EXISTS `Termekek`(
	`Termek_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Leiras` varchar(300) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Ar` int NOT NULL,
	`Min_rendelesi_menny` int NOT NULL,
	`Foto` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Keszlet_menny` int(11) NOT NULL,
	`ME_ID` int references Mertekegysegek(ME_ID),
	`K_ID` int references Kategoriak(K_ID),
	`T_ID` int references Termelok(T_ID),
	PRIMARY KEY(`Termek_ID`)
);

-- Vasarlok(V_ID, Nev, Cim, Szall_cim, Tel, Email
CREATE TABLE IF NOT EXISTS `Vasarlok`(
	`V_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Nev` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Cim` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Szall_cim` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Tel` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Jelszo` varchar(30) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	PRIMARY KEY(`V_ID`)
);

-- Uzenetek(U_ID, Szoveg, Datum)
CREATE TABLE IF NOT EXISTS `Uzenetek`(
	`U_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Szoveg` varchar(1000) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Datum` date,
	`T_ID` int references Termelok(T_ID),
	`V_ID` int references Vasarlok(V_ID),
	PRIMARY KEY(`U_ID`)
);

-- Megrendelesek(M_ID, Mennyiseg, Szall_cim, Statusz, Datum)
CREATE TABLE IF NOT EXISTS `Megrendelesek`(
	`M_ID` int(11) NOT NULL AUTO_INCREMENT,
	`Mennyiseg` int(11) NOT NULL,
	`Szall_cim` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Statusz` varchar(15) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
	`Datum` date,
	`Termek_ID` int references Termekek(Termek_ID),
	`V_ID` int references Vasarlok(V_ID),
	PRIMARY KEY(`M_ID`)
);

-- Promociok(Termek_ID (kulso kulcs), Ar, Periodus_k, Periodus_v)
CREATE TABLE IF NOT EXISTS `Promociok`(
	`Termek_ID` int references Termekek(Termek_ID),
	`Ar` int NOT NULL,
	`Periodus_k` date,
	`Periodus_v` date
);
