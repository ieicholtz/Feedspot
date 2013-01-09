<?php 
//error_reporting(E_ALL);
if(!isset($_SESSION)) {
    session_start();
    session_regenerate_id();
}
$return = array();

if($_SESSION['logged_in'] == true) {
	$user = $_SESSION['user'];
	$rssret = array();
	$inactives = array();
	$actives = array();
	$return = array('error'=>"db fail");

	require('db.php');	
	
	$sql="SELECT * FROM rss_feed";	
	$result=mysql_query($sql);
	//echo mysql_error();
	while($row=mysql_fetch_assoc($result)){		
		$id=$row['id'];
		$title=$row['title'];
		$img=$row['img'];
		$url=$row['url'];
		$rssret[$id]=array('title'=>$title, 'id'=>$id, 'url'=>$url);
	}
	//echo $return[$id]['title'];
	//print_r($return);
	$sql="SELECT * FROM user_accounts WHERE login='".$user."'";	
	$result=mysql_query($sql);
	//echo mysql_error();
	while($row=mysql_fetch_assoc($result)){
		$activefeed=explode(",", $row['activefeeds']);
		$activelist=explode(",", $row['ownedfeeds']);
	}
	//echo $activefeed;
	for($i=0; $i<count($activelist); $i++){
		if(array_search($activelist[$i], $activefeed)!==false){
			$temp = $activelist[$i];
			//echo $return[$temp]['title'];
			array_push($actives, array('title'=>$rssret[$temp]['title'], 'id'=>$rssret[$temp]['id'], 'url'=>$rssret[$temp]['url'] ));
		}else{
			$temp = $activelist[$i];
			array_push($inactives, array('title'=>$rssret[$temp]['title'], 'id'=>$rssret[$temp]['id'], 'url'=>$rssret[$temp]['url']));
		}
	}
	$return = array('inactives'=>$inactives, 'actives'=>$actives);
	
}else{
	$return = array('error'=>"not logged in");
}
echo json_encode($return);
?>