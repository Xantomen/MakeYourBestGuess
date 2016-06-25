
<?php 

	include_once 'db_connect.php';
	include_once 'functions.php';

	//Fixes encoding issue that was happening only in the Hostgator server but not in localhost
	mysqli_set_charset($mysqli,"utf8");
		
	$sql="SELECT * FROM `questions` ORDER BY RAND() LIMIT 0,1";
	
	$result = mysqli_query($mysqli,$sql);
	  
	$row = mysqli_fetch_array($result);
	
	//Returning an encoded json string of the selected question
			
	echo json_encode($row);
	
	//Characters introduced as a separator between the question data and the articles data, to be splited afterwards
	
	echo json_encode("##@@##");
			
	if(empty($row))
	{
		echo "NO QUESTIONS FOUND";
	}		
	else 
	{
		$sql2="SELECT * FROM `articles` WHERE `question_id`=".$row["question_id"];
		
		$result2 = mysqli_query($mysqli,$sql2);
		
		$num_rows = mysqli_num_rows($result2);
			
		//If not finding any templates that fit the parameters
		if($num_rows == 0)
		{
			//echo $num_rows;
		}
		else {
						
			$data = array();
			
			while ($row2 = mysqli_fetch_array($result2)) {
			   $data[] = $row2;
			}
			
			echo json_encode($data);
			
		}
		
		mysqli_free_result($result);
		
	}
	

	mysqli_close($mysqli);
	
				
?>
