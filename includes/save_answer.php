
<?php 

	include_once 'db_connect.php';
	include_once 'functions.php';
	
	sec_session_start();

	if (isset($_POST['question_id']) 
	&& isset($_POST['emailResponder'])
	&& isset($_POST['responseValue'])
	&& isset($_POST['clicksPositive'])
	&& isset($_POST['clicksNeutral'])
	&& isset($_POST['clicksNegative'])
	&& isset($_POST['submissionDate']))
	{
				
		//Fixes encoding issue that was happening only in the Hostgator server but not in localhost
		mysqli_set_charset($mysqli,"utf8");
		
		$question_id= $_POST['question_id'];
		$question_id = mysqli_real_escape_string($mysqli,$question_id);
		
		$emailResponder = $_POST['emailResponder'];
		$emailResponder = mysqli_real_escape_string($mysqli,$emailResponder);
		$responseValue = $_POST['responseValue']; 
		$responseValue = mysqli_real_escape_string($mysqli,$responseValue);
		$clicksPositive = $_POST['clicksPositive'];
		$clicksPositive = mysqli_real_escape_string($mysqli,$clicksPositive);
		$clicksNeutral = $_POST['clicksNeutral'];
		$clicksNeutral = mysqli_real_escape_string($mysqli,$clicksNeutral);
		$clicksNegative = $_POST['clicksNegative'];
		$clicksNegative = mysqli_real_escape_string($mysqli,$clicksNegative);
		$submissionDate = $_POST['submissionDate'];
		$submissionDate = mysqli_real_escape_string($mysqli,$submissionDate);
			
				
		$sql="SELECT * FROM `answers` WHERE `question_id` = '".$question_id."' AND `emailResponder` = '".$emailResponder."' AND `responseValue` = '".$responseValue."'";
		
		$result = mysqli_query($mysqli,$sql);
		  
		$row = mysqli_fetch_array($result);
		
		if(empty($row) || $emailResponder=="" )
		{		
			
			
			
			$sql="INSERT INTO `answers`(`question_id`, `emailResponder`, `responseValue`, `clicksPositive`,`clicksNeutral`, 
			`clicksNegative`,`submissionDate`) 
			VALUES ('value01','value02','value03','value04','value05','value06','value07')";
			
			$sql = str_replace("value01",$question_id,$sql);
			$sql = str_replace("value02",$emailResponder,$sql);
			$sql = str_replace("value03",$responseValue,$sql);	
			$sql = str_replace("value04",$clicksPositive,$sql);
			$sql = str_replace("value05",$clicksNeutral,$sql);
			$sql = str_replace("value06",$clicksNegative,$sql);
			$sql = str_replace("value07",$submissionDate,$sql);
			
			
			//Adding this replace to prevent fringe cases html code injection
			//It won't matter as long as I keep using .val() to get values.
			//Not using it for now, for cleaner code, less chasing arpund the special characters
			//$sql = str_replace("<","&lt",$sql); 
			
			$result = mysqli_query($mysqli,$sql);
			
			if($result == FALSE)
		    {
		        die('ERROR : ' . mysql_error());
	
		    }
			else {
				echo json_encode($result); 
			}
			
		}
		else {
				
			echo "ERROR: ANSWER ALREADY EXISTS";
		}
		
  
	} 

	mysqli_close($mysqli);
				
?>
