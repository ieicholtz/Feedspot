<?php
//modify.php?id=1&state=1

require('db.php');

if(!isset($_SESSION)) {
    session_start();
    session_regenerate_id();
}
function array_remove($arr,$value) {
   return array_values(array_diff($arr,array($value)));
}
if($_SESSION['logged_in'] == true) {
	//echo json_encode(array('sucess'=>$_GET['id']));
	$id=$_GET['id'];
	$addrem=$_GET['addrem'];
	$user = $_SESSION['user'];
	$phpreturn = array("error"=>"unknown error");
	
	$sql="SELECT * FROM user_accounts WHERE login='".$user."'";	
	$result=mysql_query($sql);
	while($row=mysql_fetch_assoc($result)){
		$actives=explode(",", $row['activefeeds']);
	}
	//print_r($actives);
	if($addrem!="actives"){
		$newactives=array_remove($actives, $id);
		$areturn = implode(",", $newactives);
	}else{
		array_push($actives,$id);
		$areturn = implode(",", $actives);
	}
	
	
	$sql="UPDATE user_accounts SET activefeeds='$areturn' WHERE login='$user'";
	if(mysql_query($sql)){
		$phpreturn = array("success"=>true);
	//worked
	}else{
		$phpreturn = array("error"=>mysql_error());
	//error
	}
}else{
	$phpreturn = array("error"=>"not logged in");
}
echo json_encode($phpreturn);
?>
