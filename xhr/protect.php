<?php
//use the isset function to see if the session variable has been set.  if not start a new session and regenerate the id
if(!isset($_SESSION)) {
    session_start();
    session_regenerate_id();
}
//check to see if the session variable logged_in is set to true.  if not the redirect the user to the login page.
if($_SESSION['logged_in'] == true) {
	//header('Location: login.php');
	$phpreturn = array('user'=>$_SESSION['user']);
}else{
	$phpreturn = array('error'=>'not logged in');
}
echo json_encode($phpreturn);
?>