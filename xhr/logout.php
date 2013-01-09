<?php
//set the session variable logged_in to false
$_SESSION['logged_in'] = false;
$_SESSION['user'] = false;

$_SESSION = array();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-42000, '/');
}

echo json_encode(array("success"=>true));
?>