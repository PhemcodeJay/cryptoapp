-- -----------------------------------------------------
-- Schema for Web3 Crypto Trading App (Hyperliquid Support)
-- Supports MetaMask, Trust Wallet, Hyperliquid Futures
-- MySQL version: 8+
-- Charset: utf8mb4
-- Collation: utf8mb4_general_ci
-- -----------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `walletAddress` VARCHAR(42) NOT NULL,
  `nonce` TEXT DEFAULT NULL,
  `username` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `profileComplete` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wallet_address` (`walletAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `wallets`
-- -----------------------------------------------------
CREATE TABLE `wallets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `chain` VARCHAR(50) NOT NULL,
  `label` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_chain_address` (`user_id`, `chain`, `address`),
  CONSTRAINT `fk_wallet_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `bots`
-- -----------------------------------------------------
CREATE TABLE `bots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `exchange` VARCHAR(50) NOT NULL DEFAULT 'hyperliquid',
  `symbol` VARCHAR(20) NOT NULL,
  `timeframe` VARCHAR(10) NOT NULL DEFAULT '1h',
  `strategy` VARCHAR(100) NOT NULL DEFAULT 'ma_macd_rsi_stoch_vol',
  `min_investment` DECIMAL(10,2) NOT NULL DEFAULT 5.00,
  `take_profit_pct` DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  `stop_loss_pct` DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  `leverage` INT NOT NULL DEFAULT 10,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bot_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `bot_trades`
-- -----------------------------------------------------
CREATE TABLE `bot_trades` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bot_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(20) NOT NULL,
  `side` ENUM('buy', 'sell') NOT NULL,
  `entry_price` DECIMAL(18,8) NOT NULL,
  `exit_price` DECIMAL(18,8) DEFAULT NULL,
  `quantity` DECIMAL(18,8) NOT NULL,
  `leverage` INT NOT NULL DEFAULT 10,
  `liquidation_price` DECIMAL(18,8) DEFAULT NULL,
  `profit_usdt` DECIMAL(12,4) DEFAULT NULL,
  `pnl_pct` DECIMAL(6,2) DEFAULT NULL,
  `status` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  `opened_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_trade_bot`
    FOREIGN KEY (`bot_id`) REFERENCES `bots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `bot_signals`
-- -----------------------------------------------------
CREATE TABLE `bot_signals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bot_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(20) NOT NULL,
  `signal_type` ENUM('buy', 'sell', 'hold') NOT NULL,
  `confidence` DECIMAL(5,2) DEFAULT NULL,
  `generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_signal_bot`
    FOREIGN KEY (`bot_id`) REFERENCES `bots` (`id`) ON DELETE CASCADE,
  INDEX `idx_signal_symbol_time` (`symbol`, `generated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `indicator_values`
-- -----------------------------------------------------
CREATE TABLE `indicator_values` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bot_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(20) NOT NULL,
  `timeframe` VARCHAR(10) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `ma_20` DECIMAL(18,8) DEFAULT NULL,
  `ma_200` DECIMAL(18,8) DEFAULT NULL,
  `macd` DECIMAL(18,8) DEFAULT NULL,
  `rsi` DECIMAL(8,4) DEFAULT NULL,
  `stoch_rsi` DECIMAL(8,4) DEFAULT NULL,
  `volume` DECIMAL(18,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_indicator_bot`
    FOREIGN KEY (`bot_id`) REFERENCES `bots` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_indicator` (`bot_id`, `symbol`, `timeframe`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `asset_analysis`
-- -----------------------------------------------------
CREATE TABLE `asset_analysis` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wallet_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(50) NOT NULL,
  `timeframe` VARCHAR(10) NOT NULL,
  `rsi` DECIMAL(8,4),
  `macd` DECIMAL(12,6),
  `stoch_rsi` DECIMAL(8,4),
  `bollinger_upper` DECIMAL(18,8),
  `bollinger_lower` DECIMAL(18,8),
  `moving_avg_20` DECIMAL(18,8),
  `moving_avg_200` DECIMAL(18,8),
  `volume_sma` DECIMAL(18,4),
  `signal_generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_asset_analysis_wallet`
    FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE,
  INDEX `idx_wallet_symbol_timeframe` (`wallet_id`, `symbol`, `timeframe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `wallet_balance`
-- -----------------------------------------------------
CREATE TABLE `wallet_balance` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wallet_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(50) NOT NULL,
  `balance` DECIMAL(36,18) NOT NULL DEFAULT 0,
  `price` DECIMAL(18,8) NOT NULL DEFAULT 0,
  `value` DECIMAL(36,8) GENERATED ALWAYS AS (`balance` * `price`) STORED,
  `asset_class` VARCHAR(50),
  `change_24h` DECIMAL(8,4),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_balance_wallet`
    FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE,
  INDEX `idx_wallet_symbol` (`wallet_id`, `symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------
-- Table `wallet_transactions`
-- -----------------------------------------------------
CREATE TABLE `wallet_transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wallet_id` INT UNSIGNED NOT NULL,
  `symbol` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(36,18) NOT NULL DEFAULT 0,
  `price` DECIMAL(18,8) NOT NULL DEFAULT 0,
  `transaction_type` ENUM('deposit', 'withdrawal') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_transaction_wallet`
    FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE,
  INDEX `idx_wallet_symbol_tx` (`wallet_id`, `symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
