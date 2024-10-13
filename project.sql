-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 13, 2024 at 04:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id_category` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id_category`, `name`) VALUES
(1, 'Dog'),
(2, 'Cat'),
(3, 'Bird'),
(4, 'Fish'),
(5, 'Accessory'),
(6, 'Elephantito'),
(14, 'Food'),
(23, 'Mouse'),
(24, 'Turtle'),
(25, 'Toy');

-- --------------------------------------------------------

--
-- Table structure for table `Employee`
--

CREATE TABLE `Employee` (
  `nombre` varchar(150) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `id_product` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `inventory` int(11) NOT NULL,
  `stock` tinyint(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `rate` int(1) DEFAULT NULL,
  `image` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`id_product`, `name`, `description`, `price`, `inventory`, `stock`, `comment`, `color`, `size`, `rate`, `image`) VALUES
(1, 'ddddog food 2H', 'Feed your dog', 50.55, 500, 1, NULL, 'bue', 'XL', NULL, NULL),
(5, 'bird', 'comprennnn', 5000.00, 50, 1, '', 'ii', 'Grande', 0, NULL),
(6, 'BetaFish', 'pez', 150.00, 0, 0, '', 'Blue', 'L', NULL, NULL),
(10, 'mickey mouse', 'esun raton', 50.00, 100, 1, '', 'azul', '', NULL, NULL),
(11, 'juguete de tortuga', 'esto es juguete de tortuga', 100.00, 10, 1, '', 'Azul', 'Grande', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ProductCategory`
--

CREATE TABLE `ProductCategory` (
  `id_product` int(11) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ProductCategory`
--

INSERT INTO `ProductCategory` (`id_product`, `id_category`) VALUES
(1, 5),
(10, 5),
(10, 23),
(11, 24),
(11, 25);

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `role_name` enum('user','employee','administrator') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id_rol`, `role_name`) VALUES
(1, 'user'),
(2, 'employee'),
(3, 'administrator');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id_user` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `credit_card_name` varchar(50) DEFAULT NULL,
  `credit_card_number` varchar(16) DEFAULT NULL,
  `credit_card_exp` char(20) DEFAULT NULL,
  `cvv` int(20) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id_user`, `name`, `lastname`, `email`, `password`, `id_rol`, `address`, `city`, `country`, `zipcode`, `telephone`, `credit_card_name`, `credit_card_number`, `credit_card_exp`, `cvv`, `status`, `last_login`) VALUES
(10, 'Elena', 'Rivera', 'randy@gmail.com', 'perro', 1, 'perro', 'lll', 'kk', 'k', '88', 'fiufiu', NULL, '99', 955, 1, '2024-10-04 06:38:38'),
(12, 'LOla', 'Hernandez', 'fridan@gmail.com', 'perro', 2, 'perro', 'Portugal', 'Guatemala', 'k', '22222222', 'hola', '28981162', '5', 3222, 1, '2024-10-06 16:50:28'),
(13, 'Humberto', 'Venavente', 'humbe@gmail.com', 'perro', 3, 'providencia', 'gautemala', 'guatemala', '01001', '59697956', 'jose najar', '1234567891234567', '10242028', 543, 1, '2024-10-12 23:41:39'),
(17, 'Fernanda', 'Porras', 'fernanda@gmail.com', 'perro', 3, 'UNIS', 'nose', 'Guatemala', '01111', '22222222', 'joooose', '123456778988', '02032024', 2022, 1, NULL),
(18, 'Jose', 'Alonzo', 'josealonzo@gmail.com', 'perro', 3, 'UNIS', 'nose', 'Guatemala', '01001', '22222222', NULL, NULL, NULL, 0, 1, '2024-10-10 19:35:37'),
(20, 'Javier', 'Alvarez', 'javieralvarez@gmail.com', 'perro', 3, 'UNIS', 'nose', 'Guatemala', '01001', '22222222', 'javier', '123467889451265', '022026', 202, 1, '2024-10-12 22:36:35'),
(21, 'Gio', 'Gio', 'gio@gmail.com', 'perro', 2, '', '', '', '', '', '', '', '', 0, 1, NULL),
(22, 'Gio1', 'Leiva', 'giogio@gmai.com', 'gato', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, '2024-10-12 15:41:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id_product`);

--
-- Indexes for table `ProductCategory`
--
ALTER TABLE `ProductCategory`
  ADD PRIMARY KEY (`id_product`,`id_category`),
  ADD KEY `id_category` (`id_category`),
  ADD KEY `id_product` (`id_product`) USING BTREE;

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `Product`
--
ALTER TABLE `Product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ProductCategory`
--
ALTER TABLE `ProductCategory`
  ADD CONSTRAINT `ProductCategory_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `Product` (`id_product`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductCategory_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `Category` (`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
