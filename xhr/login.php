<?php
if(empty($_GET)) {
	//if the form has not been submitted show the user a message.
    $phpreturn = array("error"=>"no credentials");
}else {
    //else if the form has been submitted.
	//set up the variables
	$login = $_GET['login'];
    $passphrase = $_GET['passphrase'];
    //require the connection strings to the database.
    require('db.php');
    //set up our mysql statement
    $sql = "SELECT id FROM user_accounts WHERE login='$login' AND passphrase='$passphrase'";
    //query the database with the above mysql statement
	$result = mysql_query($sql);
    //if the result is greater than 0, meaning that there was a match in the database to the username and password submitted then start a new session and regenerate the id
    if(mysql_num_rows($result) > 0) {
        session_start();
        session_regenerate_id();
        //set the session variable logged_in to true
        $_SESSION['logged_in'] = true;
		$_SESSION['user'] = $_GET['login'];
        //redirect the user to the index page
        //header('Location: index.html');
		$phpreturn = array("user"=>$_SESSION['user']);
    }else {
        //else if there were no matches in the database show the user a message.
		$phpreturn = array("error"=>"bad login");
    }
}
echo json_encode($phpreturn);
?>