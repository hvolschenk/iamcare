<?php
  $databaseDatabase = getenv('MYSQL_DATABASE', true);
  $databaseHost = getenv('MYSQL_HOST', true);
  $databasePassword = getenv('MYSQL_PASSWORD', true);
  $databaseUser = getenv('MYSQL_USER', true);
  $connection = new mysqli($databaseHost, $databaseUser, $databasePassword, $databaseDatabase);
  if ($connection->connect_error) {
    die('Failed to connect to the database');
  }
  echo 'Connected to the database successfully';
  $connection->close();

  phpinfo();
