<?php

include_once 'db_connect.php';
include_once 'psl-config.php';

date_default_timezone_set('Etc/UTC');

require '../libs/PHPMailer/PHPMailerAutoload.php';


//Searching for questions whose resolutionDate is earlier than NOW (in epoch time)
//It will also check if the answer has been submitted already or not
//(as the reminder message is formed with the Prediction and What really happened)

$sql = "SELECT * FROM questions WHERE `resolutionDate`<=".time()." AND `isResolved`=FALSE AND `outcomeContent` IS NOT NULL";
//$sql = "SELECT * FROM questions WHERE `resolutionDate`<=1467295966 AND `isResolved`=FALSE AND `outcomeContent` IS NOT NULL";
//$sql = "SELECT * FROM questions WHERE `resolutionDate`<=1467295966 AND `outcomeContent` IS NOT NULL";

$result = mysqli_query($mysqli,$sql) or die(mysqli_error($mysqli)); 
$num_rows  = mysqli_num_rows($result);


             
if($num_rows > 0){
    // We have at least one match. For each, find all the users that need to receive an email about this.
   	//This should be, anyone that submitted an answer about the topic, and only their last guess if they
   	//entered more than one.
   			
   	//$data = array();
   		
	while ($row = mysqli_fetch_array($result)) {
				
		$emails = "STRING->";
		
	    $question_id = $row["question_id"];
		$outcomeContent = $row["outcomeContent"];
		$outcomeContentYes = $row["outcomeContentYes"];
		$outcomeContentNo = $row["outcomeContentNo"];
		$outcomeUrl = $row["outcomeUrl"];
		$questionContent = $row["questionContent"];
		
		$outcomeContentVerbose = "";
		
		if($outcomeContent=="yes") $outcomeContentVerbose = $outcomeContentYes;
		else $outcomeContentVerbose = $outcomeContentNo;
		
		//`emailSent`=TRUE
		$sql2 = "SELECT * FROM answers WHERE `question_id`=".$question_id." AND `emailResponder`!='' ORDER BY `submissionDate` DESC";
		//$sql2 = "SELECT * FROM answers WHERE `question_id`=".$question_id." AND `emailResponder`='xantomen@gmail.com' ORDER BY `submissionDate` DESC";

		$result2 = mysqli_query($mysqli,$sql2) or die(mysqli_error($mysqli)); 
		$num_rows2  = mysqli_num_rows($result2);
		
		if($num_rows2 > 0){
			
			while ($row2 = mysqli_fetch_array($result2)) {
		
				if (strpos($emails, $row2["emailResponder"]) == FALSE) {
						
					$emailResponder = $row2["emailResponder"];
					$responseValue = $row2["responseValue"];
				
					if($responseValue=="yes") $responseValueVerbose = $outcomeContentYes;
					else $responseValueVerbose = $outcomeContentNo;
				
				    $emails = $emails.$row2["emailResponder"].";";
				    
					echo "EMAILS ----------->".$emails;				
					
					$mail = new PHPMailer;
					$mail->isSMTP();
					$mail->SMTPDebug = 2;
					$mail->Debugoutput = 'html';
					$mail->Host = 'mail.xantomen.com';
					$mail->Port = 587;
					$mail->SMTPSecure = 'tls';
					$mail->SMTPAuth = true;
					
					$mail->Username = MAILUSER;
					$mail->Password = MAILPASSWORD;
					$mail->setFrom('makeyourbestguess@xantomen.com', 'Make Your Best Guess');
					$mail->addReplyTo('makeyourbestguess@xantomen.com', 'Make Your Best Guess');
					$mail->addAddress($emailResponder, '');
					$mail->Subject = 'Make Your Best Guess: '.$questionContent.' has been resolved!';
					$mail->Body = '
					<br /> 
					Thanks for your participation!<br />
					
					
					'.$questionContent.' has been resolved! <br /><br />
					
					The answer has been:'.$outcomeContentVerbose.'.
					
					<br /><br />
					
					Your recorded prediction was: '.$responseValueVerbose.'.
					
					<br /><br /> 
										
					You can see articles detailing the result in: :<br />
					http://www.xantomen.com/makeyourbestguess/index.php#action=request_question&question_id='.$question_id.'<br /><br />';
					

					$mail->AltBody = 'The question has been resolved.';
				    
					if (!$mail->send()) {
					    echo "Mailer Error: " . $mail->ErrorInfo;
					} else {
					    echo "SENT CONFIRMATION EMAIL";
						
						$sql3="UPDATE `answers` SET `emailSent`=TRUE WHERE `question_id`=".$question_id." AND `emailResponder`='".$emailResponder."'";
										
						$result3 = mysqli_query($mysqli,$sql3);
						
						if($result3 == FALSE)
					    {
					        die('Error : ' . mysql_error());
				
					    }
						
					}
					
					
					//echo json_encode($row2); 
									
				    //$data[] = $row2["answer_id"];
				}
			}
		}
	}

	$sql4="UPDATE `questions` SET `isResolved`=TRUE WHERE `question_id`=".$question_id;
	$result4 = mysqli_query($mysqli,$sql4);
	
	
}else{
    
    echo 'NO QUESTIONS FOUND';
	
}


mysqli_close($mysqli);
exit();
    


