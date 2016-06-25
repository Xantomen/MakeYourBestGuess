
<?php 

	include_once 'db_connect.php';
	include_once 'functions.php';

	if (isset($_POST['question_id'])
	&& isset($_POST['present_ids'])
	&& isset($_POST['quantity']))
	{

		//Fixes encoding issue that was happening only in the Hostgator server but not in localhost
		mysqli_set_charset($mysqli,"utf8");
		
		$question_id= $_POST['question_id'];
		$question_id = mysqli_real_escape_string($mysqli,$question_id);
		$present_ids= $_POST['present_ids'];
		$present_ids = mysqli_real_escape_string($mysqli,$present_ids);
		$quantity= $_POST['quantity'];
		$quantity = mysqli_real_escape_string($mysqli,$quantity);
		
		$present_ids_array = split(";",$present_ids);
		$present_id_and_string = "";
			
		for($i = 0; $i < sizeof($present_ids_array); $i++) {
			
			$present_id_and_string = $present_id_and_string."`question_id`!=".$present_ids_array[$i];
			if($i < sizeof($present_ids_array)-1)
			{
				$present_id_and_string = $present_id_and_string." AND ";
			}
		}
				
				
		$sql="SELECT `question_id`,`questionContent`,`questionTopic`,`resolutionDate` FROM `questions` 
		WHERE ".$present_id_and_string." ORDER BY `resolutionDate` DESC LIMIT ".$quantity;
				
		$result = mysqli_query($mysqli,$sql);
		  		
		$num_rows = mysqli_num_rows($result);
				
		//If not finding any templates that fit the parameters
		if($num_rows == 0)
		{
			echo "NO QUESTIONS UNVISITED";
		}
		else {
						
			$data = array();
			
			while ($row = mysqli_fetch_array($result)) {
				   $data[] = $row;
			}
		}
		echo json_encode($data);
		
		mysqli_free_result($result);
	

	mysqli_close($mysqli);
	

		
	}
				
?>
