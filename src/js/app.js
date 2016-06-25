'use strict';

var ENVIRONMENT = "DEVELOPMENT";

if(document.location.hostname != "localhost") ENVIRONMENT = "PRODUCTION";


// Simple pure-React component so we don't have to remember
// Bootstrap's classes
var ResolveOptionButton = React.createClass({
      
  render: function() {
    return (
      <div {...this.props}
        className={(this.props.className || 'option_button')}></div>
    );
  }
});

var ResolutionButton = React.createClass({
	
	render: function() {
	    return (
	      <div {...this.props}
	        className={(this.props.className || 'option_button')} onClick={this.onActivation}></div>
	    );
	 },
	onActivation: function() {
				
		window.open(DatabaseData.question.outcomeUrl, "_blank", "width=700, height=600");				
		
	}
	
	
});

var ArticleObjectButton = React.createClass({
	
	getInitialState: function() {
    // Start off by selecting the first board
	    return {
	      numberArticlesReadSinceSessionStarted: this.props.numberArticlesRead
	  
	    }
	  },
	
	render: function() {
		
		var perceivedMood = this.props.perceivedMood;
				
		var classes = "article_option";
		
		var total_articles_read = AnswerData.clicksPositive + AnswerData.clicksNeutral + AnswerData.clicksNegative;
		
		var reader_imbalance_percentage = 1/3;
		var reader_imbalance = 0;
		
		if(total_articles_read > 0)
		{
			var reader_imbalance_percentage = this.props.numberArticlesRead/total_articles_read;
			
			if(reader_imbalance_percentage == 1/3)
			{
				reader_imbalance = 0;
			}
			else if(reader_imbalance_percentage < 1/3)
			{
				if(reader_imbalance_percentage < 1/3/3)
				{
					reader_imbalance = -3;
				}
				else if(reader_imbalance_percentage < 1/3/3*2)
				{
					reader_imbalance = -2;
				}
				else
				{
					reader_imbalance = -1;
				}
				
			}
			else 
			{
				if(reader_imbalance_percentage > 1/3/3*5)
				{
					reader_imbalance = 3;
				}
				else if(reader_imbalance_percentage < 1/3/3*4)
				{
					reader_imbalance = 2;
				}
				else
				{
					reader_imbalance = 1;
				}
			}
		}
		
		
		classes += " reader_imbalance_"+reader_imbalance;
		
		if(this.props.numberArticlesRead < this.props.numberArticlesTotal && this.props.numberArticlesTotal>0)
		{
			classes += " option_active";
		} else classes += " option_inactive";
				
		return (
			
			<div className="col-xs-12 col-sm-4">
				<div id="option_positive" className={classes} onClick={this.onActivation.bind(this, perceivedMood)} ><strong>{this.props.perceivedMood} Articles</strong></div>
				<div id="more_articles_positive" className="more_articles_option">Different articles leading to {this.props.perceivedMood} ({this.props.numberArticlesTotal - this.props.numberArticlesRead} left)</div>
			</div>
		);
	},
	onActivation: function(perceivedMood,event) {
				
		
		if(this.props.numberArticlesRead < this.props.numberArticlesTotal && this.props.numberArticlesTotal>0)
		{
			
			var articleIndex = this.props.numberArticlesRead;
			var urlSource = "";
		
			var perceivedMoodString = "";
		
			switch(perceivedMood)
			{
				case "Yes":
	
					AnswerData.clicksPositive += 1;
					urlSource = DatabaseData.question.positiveArticles[articleIndex].urlSource;
					DatabaseData.question.visitedPositiveArticles.push(DatabaseData.question.positiveArticles[articleIndex]);
	
					perceivedMoodString = "Positive";
	
					break;
				case "Neutral":
	
					AnswerData.clicksNeutral += 1;
					
					console.log(this.props.numberArticlesRead);
					console.log(AnswerData.clicksNeutral);
					urlSource = DatabaseData.question.neutralArticles[articleIndex].urlSource;
					DatabaseData.question.visitedNeutralArticles.push(DatabaseData.question.neutralArticles[articleIndex]);
					
					perceivedMoodString = "Neutral";
					
					break;
				case "No":
	
					AnswerData.clicksNegative += 1;
					urlSource = DatabaseData.question.negativeArticles[articleIndex].urlSource;
					DatabaseData.question.visitedNegativeArticles.push(DatabaseData.question.negativeArticles[articleIndex]);
					
					perceivedMoodString = "Negative";
					
					break;
				default:
					break;
			}
			
			this.props.core_app.forceUpdate();
				
			if(ENVIRONMENT == "PRODUCTION")
			{
				mixpanel.track("view_article", {
					"perceivedMood": perceivedMood,
			        "perceivedMoodString": perceivedMoodString,
			        "urlSource": urlSource
			    });	
			}	
			
						
			window.open(urlSource, "_blank", "width=700, height=600");
			
		}
		
							
		
	}
	
	
});

var BootstrapButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var BootstrapModal = React.createClass({
	
	getInitialState: function() {
    // Start off by selecting the first board
	    return {
	      modalTitle: this.props.title,
	      inputValidationState: ""
	    }
	  },
  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: false});

    // Bootstrap's modal class exposes a few events for hooking into modal
    // functionality. Lets hook into one of them:
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden);
  },
  componentWillUnmount: function() {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden);
  },
  close: function() {
    $(this.refs.root).modal('hide');
  },
  open: function() {
    $(this.refs.root).modal('show');
    
    this.setState({
      inputValidationState: "",
      modalTitle: this.props.title
   	});
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;

    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton
          onClick={this.handleConfirm}
          className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    if (this.props.cancel) {
      cancelButton = (
        <BootstrapButton onClick={this.handleCancel} className="btn-default">
          {this.props.cancel}
        </BootstrapButton>
      );
    }

    return (
      <div className="modal fade" ref="root">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}>
                &times;
              </button>
              <h3>{this.state.modalTitle}</h3>
            </div>
            <div className="modal-body">
              {this.props.children}
              <Input input_type="email" input_validation={this.state.inputValidationState} input_placeholder="Write your email here"/>
            </div>
            <div className="modal-footer">
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      
      var save_answer = saveAnswerToDatabase("on_cancel");
      
      this.props.onCancel();
 
      
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {

      var save_answer = saveAnswerToDatabase("");
            
      if(save_answer == "invalid_email")
      {
		this.setState({
	      inputValidationState: "incorrect_field",
	      modalTitle: "Invalid Email Address"
	   	});
	    
      }
      else if(save_answer!="save_error")
      {
      	this.props.onConfirm();
      }
      
    }
  },
  handleHidden: function() {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  }
  
});

var Input = React.createClass({
	
	render:function() {
		
		return (
			
			<input type={this.props.input_type} className={this.props.input_validation} onChange={this.updateEmailValue} placeholder={this.props.input_placeholder}/>
		);
	},
  	updateEmailValue: function(event) {
  		
  		AnswerData.emailResponder = event.target.value;
  	
  	}
	
});

var BufferQuestion= React.createClass({

	
	render: function() {
		
		return (
			
			<li><div question_id={this.props.question_id} className="guess_question text-center" onClick={this.requestLoadQuestion}>{this.props.questionContent}</div></li>
		);
		
	},
  	requestLoadQuestion: function() {
  	
  		if(ENVIRONMENT == "PRODUCTION")
		{
	  		mixpanel.track("interaction", {
				"interaction_type": "load_new_question",
				"question_id":this.props.question_id
		    });	
  		}
  	
	  	loadQuestionById(this.props.question_id);
		
		
		AnswerData.clicksPositive = 0;
		AnswerData.clicksNeutral = 0;
		AnswerData.clicksNegative = 0;
		
		//this.props.core_app.forceUpdate();
	 }
	
	
});

var GuessApp = React.createClass({

  getInitialState: function() {
    // Start off by selecting the first board
    return {
      loadedInitialQuestions: false,
      responseValue: "",
      modalTitle: "Create a reminder",
      modalBody: "",
      
    }
  },

  handleCancel: function() {
    //if (confirm('Are you sure you want to cancel?')) {
      this.refs.modal.close();
    //}
  },
  render: function() {
  	  	
  	  	
    var modal = null;
            
    modal = (
      <BootstrapModal
        ref="modal"
        confirm="Submit"
        cancel="Cancel"
        responseValue={this.state.responseValue}
        onCancel={this.handleCancel}
        onConfirm={this.closeModal}
        onHidden={this.handleModalDidClose}
        title={this.state.modalTitle}>
        	{this.state.modalBody}
        	<br/>
	
      </BootstrapModal>
    );
     
    var numberArticlesTotalPositive = DatabaseData.question.positiveArticles.length;
    var numberArticlesTotalNeutral = DatabaseData.question.neutralArticles.length;
    var numberArticlesTotalNegative = DatabaseData.question.negativeArticles.length;
     
    var bufferquestions_array = [];
    
    for(var i=0;i<DatabaseData.loadedQuestions.length;i++)
    {
    	var question_data = DatabaseData.loadedQuestions[i];
    	
    	var bufferquestion = <BufferQuestion core_app={this} key={i} question_id={DatabaseData.loadedQuestions[i].question_id} questionContent={DatabaseData.loadedQuestions[i].questionContent} 
    	onClick={this.requestMoreBufferQuestions}/>;
    	bufferquestions_array.push(bufferquestion);
    	
    }
     
     //<option className="guess_question text-center btn btn-primary" onClick={this.requestMoreBufferQuestions}>Load More Questions</option>
     
    var bodyContent = null;
    
    var outcomeContent = DatabaseData.question.outcomeContent
    
    var outcomeContentVerbose = "";
    
    if(outcomeContent == "yes") outcomeContentVerbose = DatabaseData.question.outcomeContentYes;
    else outcomeContentVerbose = DatabaseData.question.outcomeContentNo;
    
    
    if(DatabaseData.question.isResolved == 0)
    {

    	bodyContent = (
    		<div>
	    		<div id="articles_call_to_action" className="text-center"><strong>Step 1:</strong> You can inform yourself on different views on the topic, by reading these diverse articles, leaning to different sides of the argument:
	    		</div>
	    		
	    		<div id="article_attention_legend_label" className = "row text-center">
		    		<em className="h6">(The thicker and darker the border the more a side is neglected)</em>
		    	</div>
	    		
	    		<div id="articles_container" className="row text-center">
	    			<ArticleObjectButton core_app={this} perceivedMood="Yes" numberArticlesTotal={numberArticlesTotalPositive} numberArticlesRead={AnswerData.clicksPositive}/>
	    			<ArticleObjectButton core_app={this} perceivedMood="Neutral" numberArticlesTotal={numberArticlesTotalNeutral} numberArticlesRead={AnswerData.clicksNeutral}/>
	    			<ArticleObjectButton core_app={this} perceivedMood="No" numberArticlesTotal={numberArticlesTotalNegative} numberArticlesRead={AnswerData.clicksNegative}/>
	    			
	    		</div>
	    		
	    		{/*<div id="article_attention_legend_container" className="text-center">
		    		
		    		<div id="articles_attention_legend" className = "row">
		    			<div className="attention_legend reader_imbalance_-3 col-xs-3"></div>
		    			<div className="attention_legend reader_imbalance_-2 col-xs-1"></div>
		    			<div className="attention_legend reader_imbalance_-1 col-xs-1"></div>
		    			<div className="attention_legend reader_imbalance_0 col-xs-2"></div>
		    			<div className="attention_legend reader_imbalance_1 col-xs-1"></div>
		    			<div className="attention_legend reader_imbalance_2 col-xs-1"></div>
		    			<div className="attention_legend reader_imbalance_3 col-xs-3"></div>
		    		</div>
		    		<div id="articles_attention_legend_scale" className = "row">
		    			<div className="col-xs-3">Very neglected</div>
		    			<div className="col-xs-2 col-xs-offset-2">Good balance</div>
		    			<div className="col-xs-3 col-xs-offset-2">Strongly lenient</div>
		    		</div>
		    	</div>*/}
	    		
	    		<div id="once_informed" className="row text-center">
	    			<div><strong>Step 2:</strong> Once you are informed, you can answer here:</div>
				</div>
						    
				<div id="yes_no_radiogroup" className="row text-center">
					<div id="button_yes" className="btn btn-info col-xs-5 col-xs-offset-1 option_button">
				    	{modal}
				      	<ResolveOptionButton onClick={this.responseButtonAction.bind(this, 'yes')}>
				          Yes
				        </ResolveOptionButton>
				    </div>
				    <div id="button_no" className="btn btn-info col-xs-5 option_button">
				    	{modal}
				      	<ResolveOptionButton onClick={this.responseButtonAction.bind(this, 'no')}>
				          No
				        </ResolveOptionButton>
				    </div>
				</div>
			</div>);
			
    } else {

		bodyContent = (
			
			<div className="text-center">

		    	<div className="h2">The Outcome has been: </div>
		    	<div className="h1">{outcomeContentVerbose}</div>
		    	
		    	<div className="row">
    			
				</div>
			
		    	<div className="row">
			    	<ResolutionButton className="btn btn-info option_button">
			          More information on the Results
			        </ResolutionButton>
		        </div>
		    </div>
		    );
    }
    
     
    return (
  		
  		<div id="container_all" className="container-fluid">	
    		<div id="guess_questions_container" className="h1 center-block dropdown">
			  <button id="question_dropdown_button" onClick={this.loadInitialQuestions} className="guess_question_chosen btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
			  {this.props.questionContent}
  			  <span className="caret"></span></button>
  			  <ul className="dropdown-menu centerDropdown">
			    {bufferquestions_array}
			    <li className="divider"></li>
			    <li><div id="load_more_questions" className="btn btn-info center-block" onClick={this.requestMoreBufferQuestions}>Load More Questions</div></li>
			  </ul>
			</div>
				
			<h6 id="resolution_date" className="text-center">Question to be resolved on <strong>{this.props.resolutionDate}</strong></h6>
			
			
  			{bodyContent}
  			
		</div>
  		
		
    );
  },
  responseButtonAction: function(responseValue,event) {
  	
  	var responseValue = responseValue;
  	var modalBody = "";
  	
  	modalBody += "You answered "+responseValue+".";
  	modalBody += "\nIntroduce your email address below and we will remind you what you chose once the question is resolved on "+this.props.resolutionDate+".\nThank you!";
  	  	
    this.setState({
      responseValue: responseValue,
      modalBody: modalBody
    });
    
    this.openModal();
    
    AnswerData.responseValue = responseValue;
    
    if(ENVIRONMENT == "PRODUCTION")
	{
	    mixpanel.track("interaction", {
			"interaction_type": "response_button_first_click",
			"responseValue": responseValue
			
	    });	
	 }
  },
  openModal: function() {
  	
    this.refs.modal.open();
  },
  closeModal: function() {
    this.refs.modal.close();
  },
  handleModalDidClose: function() {
    //alert("The modal has been dismissed!");
  },
  setChosenValue: function() {
  	
  },
  loadInitialQuestions: function() {
  	if(this.state.loadedInitialQuestions == false)
  	{
  		
  		this.setState({
	      loadedInitialQuestions: true
	   });
  		
  		loadMoreBufferQuestions(this);
  	}
  },
  requestMoreBufferQuestions: function(evt) {
  	
  	if(ENVIRONMENT == "PRODUCTION")
	{
	  	mixpanel.track("interaction", {
			"interaction_type": "load_more_questions",
	    });	
  	}
  	
	$("#question_dropdown_button").click();
  	loadMoreBufferQuestions(this);
  }

  
});

//Object which contains the loaded data from the database
/*
 * The structure being:
 * 	DatabaseData {
 * 		
 * 		question: {
 * 	
 * 			question_id: int
 * 			questionType: string describing the type of question (initially just yes_no_neutral)
 * 			questionContent: string with the text for the actual question to ask
 * 			questionTopic: string with the topic of the question (intially politics)
 * 			importance: int value of the importance / trendiness of the question
 * 			resolutionDate: string value with the epoch timestamp
 * 			resolutionDateString: string same as resolutionDate but in a human readable string in format Day,Month,Year
 * 			keywordsSearched: string value with the keywords used to search for this question separated by commas
 * 			isResolved: boolean true or false, if the date has been reached
 * 			outcomeContent: string what the response was in reality
 * 			outcomeContentYes: string to show instead of "yes"
 * 			outcomeContentNo: string to show instead of "no"
 * 			outcomeUrl: a Url that directs you to an explanation on why
 * 
 * 			negativeArticles: array of articles with perceivedMood negative for the selected question
 * 			neutralArticles: array of articles with perceivedMood neutral for the selected question
 * 			positiveArticles: array of articles with perceivedMood positive for the selected question
 * 			visitedNegativeArticles: array of articles with perceivedMood negative for the selected question that have been already viewed
 * 			visitedNeutralArticles: array of articles with perceivedMood neutral for the selected question that have been already viewed
 * 			visitedPositiveArticles: array of articles with perceivedMood positive for the selected question that have been already viewed
 * 
 * 
 * 		},
 * 		//Ids,questionContent,questionTopic and resolutionDate of other questions available to choose
 * 		loadedQuestions: [{
 * 			question_id: int
 * 			questionContent: string with the text for the actual question to ask
 * 			questionTopic: string with the topic of the question (intially politics)
 * 			resolutionDate: string value with the epoch timestamp
 * 		},*]
 * 
 * 
 * 		Description of each of the article objects inside negativeArticles,positiveArticles and neutralArticles:
 * 		{
 * 			article_id: int
 * 			question_id: id of the question
 * 			urlSource: string with the URL where this articles can be found
 * 			timesShown: int times this article has been shown to all users
 * 			perceivedMood: int value of the perceivedMood of this article (-10 to 10)
 * 			moodType: string defining the type of question this article could be seen with (yes_no_neutral, left_right_center...)
 * 			capturedDate : string epoch timestamp of the time when this was found by our spider
 * 			creationDate: string epoch timestamp in which the source article was posted
 * 			
 * 		}
 * 
 * 
 * }
 * 		
 * 
 * 
 * 
 * 
 */

var DatabaseData = null;

var AnswerData = {emailResponder:"",responseValue:"",clicksPositive:0,clicksNeutral:0,clicksNegative:0,submissionDate:""};

var QUESTIONS_PER_BATCH = 5;

initiateApp();

function restart_url() {
	window.location.hash = window.location.hash.split("#")[0];
}

function changeUrlToId(question_id) {
	window.location.hash = window.location.hash.split("#")[0]+"action=request_question&question_id="+question_id;
}

function initiateApp() {
		
	var action = getURLParameter("action");
	
	switch(action)
	{
		case "request_question":
		
			var question_id = getURLParameter("question_id");
						
			loadQuestionById(question_id);
			
			break;
		
		case "send_emails":
		
			$.ajax({  
			    type: "POST",  
				url: "includes/resolve_question_send_emails.php",       
				success: function(json_data){ 	       
				   
				   console.log(json_data);
				   
				   /*if(json_data.indexOf("NO QUESTIONS FOUND") == -1)
					{
						onLoadQuestion(json_data);
						
						ReactDOM.render(<GuessApp 
							question_id={DatabaseData.question.question_id}
							questionContent={DatabaseData.question.questionContent}
							resolutionDate={DatabaseData.question.resolutionDateString}
							
						 />, document.getElementById('makeyourbestguess_react'));
						
					}*/
				
				},
				error: function() {
					
					
				}
			});
			
			break;
			
		default:
							
			loadRandomQuestion();
		
			break;
		
			
	}
	
	if(ENVIRONMENT == "PRODUCTION")
	{
		mixpanel.track("web_started", {
	        "action_type": action
	    });	
	    
	    mixpanel.identify(mixpanel.get_distinct_id());
			
		mixpanel.people.set({
		    "$last_login": new Date()         // properties can be dates...
		});
	}
	
	
}

function loadRandomQuestion() {
	
	$.ajax({  
	    type: "POST",  
		url: "includes/return_random_question.php",       
		success: function(json_data){ 	       
		   
		   if(json_data.indexOf("NO QUESTIONS FOUND") == -1)
			{
				onLoadQuestion(json_data);
				
				ReactDOM.render(<GuessApp 
					question_id={DatabaseData.question.question_id}
					questionContent={DatabaseData.question.questionContent}
					resolutionDate={DatabaseData.question.resolutionDateString}
					
				 />, document.getElementById('makeyourbestguess_react'));
				
			}
		
		},
		error: function() {
			
			
		}
	});
	
}

function loadQuestionById(question_id) {
	
	
	if(question_id)
	{
	
		$.ajax({  
		    type: "POST",  
			url: "includes/return_question_by_id.php", 
			data: {question_id:question_id},     
			success: function(json_data){ 	       
			   
			   if(json_data.indexOf("NO QUESTIONS FOUND") == -1)
				{
					onLoadQuestion(json_data);
					
					ReactDOM.render(<GuessApp 
						question_id={DatabaseData.question.question_id}
						questionContent={DatabaseData.question.questionContent}
						resolutionDate={DatabaseData.question.resolutionDateString}
						
					 />, document.getElementById('makeyourbestguess_react'));
					
				}
			
			},
			error: function() {
				
				
			}
		});
	}
	
}


function onLoadQuestion(json_data) {
		
	var split_array = json_data.split('"##@@##"');
	var question_data = split_array[0];
	var articles_data = split_array[1];
	
	var parsed_question_data  = new Object;
	var parsed_articles_data = [];
	
	if(question_data.length)
	{
		parsed_question_data = $.parseJSON(question_data);
	}
	if(articles_data.length)
	{
		parsed_articles_data = $.parseJSON(articles_data);
	}
	
	var previousLoadedQuestions = [];
	
	if(DatabaseData != null)
	{
		if(DatabaseData.loadedQuestions != null && DatabaseData.loadedQuestions.length != 0)
		{
			previousLoadedQuestions = DatabaseData.loadedQuestions;
		}
	}
	
	
	DatabaseData = new Object;
	
	var question = new Object;
	
	question.question_id = parsed_question_data["question_id"];
	question.questionType = parsed_question_data["questionType"];
	question.questionContent = parsed_question_data["questionContent"];
	question.questionTopic = parsed_question_data["questionTopic"];
	question.importance = parsed_question_data["importance"];
	
	var resolutionDate = transformEpochTimestampToDate(parsed_question_data["resolutionDate"]);
	
	var monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	
	question.resolutionDate = resolutionDate;
	question.resolutionDateString = resolutionDate.getDate() + " " + monthNames[resolutionDate.getMonth()] + " " + resolutionDate.getFullYear() ;
	question.keywordsSearched = parsed_question_data["keywordsSearched"];
	question.isResolved = parsed_question_data["isResolved"];
	question.outcomeContent = parsed_question_data["outcomeContent"];
	question.outcomeContentYes = parsed_question_data["outcomeContentYes"];
	question.outcomeContentNo = parsed_question_data["outcomeContentNo"];
	question.outcomeUrl = parsed_question_data["outcomeUrl"];
			
	var positiveArticles = [];
	var neutralArticles = [];
	var negativeArticles = [];
	
	for(var i=0;i<parsed_articles_data.length;i++)
	{
		var perceivedMood = parsed_articles_data[i]["perceivedMood"];
			
		if(perceivedMood >= 7)
		{
			//parsed_articles_data[i]["perceivedMood"] = "Yes"; 
			positiveArticles.push(parsed_articles_data[i]);
		}
		else if(perceivedMood <= -7)
		{
			//parsed_articles_data[i]["perceivedMood"] = "No"; 
			negativeArticles.push(parsed_articles_data[i]);
		}
		else
		{
			//parsed_articles_data[i]["perceivedMood"] = "Neutral"; 
			neutralArticles.push(parsed_articles_data[i]);
		}
	}
	
	question.positiveArticles = shuffle(positiveArticles);
	question.visitedPositiveArticles = [];
	question.neutralArticles = shuffle(neutralArticles);
	question.visitedNeutralArticles = [];
	question.negativeArticles = shuffle(negativeArticles);
	question.visitedNegativeArticles = [];
		
	DatabaseData.question = question;
	
	var isAlreadyLoaded = false;
	
	for(var i=0;i<previousLoadedQuestions.length;i++)
	{
		if(question.question_id == previousLoadedQuestions[i].question_id)
		{
			isAlreadyLoaded = true;
		}
		
	}
	
	if(!isAlreadyLoaded)
	{
		previousLoadedQuestions.push(question);
	}
	
	DatabaseData.loadedQuestions = previousLoadedQuestions;
	
	
	changeUrlToId(question.question_id);
	
}

function onLoadMoreBufferQuestions(json_data,reactComponent) {
	
	var parsed_buffer_questions = $.parseJSON(json_data);
						
	var previousLoadedQuestions = [];
	
	if(DatabaseData != null)
	{
		if(DatabaseData.loadedQuestions != null && DatabaseData.loadedQuestions.length != 0)
		{
			previousLoadedQuestions = DatabaseData.loadedQuestions;
		}
	}
				
	var temp_previousLoadedQuestions = previousLoadedQuestions;
		
	for(var i=0;i<parsed_buffer_questions.length;i++)
	{
		
		var isAlreadyLoaded = false;
	
		for(var j=0;j<temp_previousLoadedQuestions.length;j++)
		{
			if(parsed_buffer_questions[i].question_id == temp_previousLoadedQuestions[j].question_id)
			{
				isAlreadyLoaded = true;
			}
		}
		if(!isAlreadyLoaded)
		{
			previousLoadedQuestions.push(parsed_buffer_questions[i]);
		}
		
	}
		
	DatabaseData.loadedQuestions = previousLoadedQuestions;
			
	reactComponent.forceUpdate();
	
		
}

function loadMoreBufferQuestions(reactComponent) {
	
	var question_id = DatabaseData.question.question_id;
	
	var quantity = QUESTIONS_PER_BATCH;
	var present_ids = "";
	
	for(var i=0;i<DatabaseData.loadedQuestions.length;i++)
	{
		present_ids += DatabaseData.loadedQuestions[i].question_id;
		
		if(i < DatabaseData.loadedQuestions.length-1)
		{
			present_ids += ";";
		}
	}
					
	$.ajax({  
	    type: "POST",  
		url: "includes/return_more_buffer_questions.php", 
		data: {
			question_id:question_id,
			present_ids:present_ids,
			quantity:quantity},     
		success: function(json_data){ 	       
		   		   
		   if(json_data.indexOf("NO QUESTIONS UNVISITED") == -1)
			{
				onLoadMoreBufferQuestions(json_data,reactComponent);
				
			}
					
		},
		error: function() {
			
			
		}
	});
}

function saveAnswerToDatabase(save_type) {
	
	var finalAnswerData = AnswerData;
	finalAnswerData.question_id = DatabaseData.question.question_id;
	
	AnswerData.submissionDate = Math.round(new Date().getTime()/1000.0);
	
	if(save_type == "on_cancel")
	{
		finalAnswerData.emailResponder = "";
		
		$.ajax({  
		    type: "POST",  
			url: "includes/save_answer.php",
			data: finalAnswerData,       
			success: function(json_data){ 	       
			   
			   if(json_data.indexOf("ERROR:") == -1)
				{
					return "saved_noemail";
				}
				else return "save_error"
			
			},
			error: function() {
				
				return "save_error";
			}
		});

	}
	else
	{		
		if(validateEmail(AnswerData.emailResponder))
		{
			
			$.ajax({  
			    type: "POST",  
				url: "includes/save_answer.php",
				data: finalAnswerData,       
				success: function(json_data){ 	       
				   
				   if(json_data.indexOf("ERROR:") == -1)
					{
						return "saved_full";
					}
					else return "save_error"
				
				},
				error: function() {
					
					return "save_error";
				}
			});
			
		} 
		else
		{
			return "invalid_email";
		}
	
	}
	
	if(validateEmail(AnswerData.emailResponder))
	{
		if(ENVIRONMENT == "PRODUCTION")
		{
			mixpanel.alias(AnswerData.emailResponder);
			
			mixpanel.people.set({
			    "$email": AnswerData.emailResponder,    // only special properties need the $
			    "$last_login": new Date()         // properties can be dates...
			});
		}
	}
	
	if(ENVIRONMENT == "PRODUCTION")
	{
		mixpanel.track("Submission", {
	        "save_type": save_type,
	        "submissionDate": AnswerData.submissionDate,
	        "question_id ": finalAnswerData.question_id,
	        "clicksPositive":finalAnswerData.clicksPositive,
	        "clicksNeutral":finalAnswerData.clicksNeutral,
	        "clicksNegative":finalAnswerData.clicksNegative,
	        "emailResponder":finalAnswerData.emailResponder,
	        "responseValue":finalAnswerData.responseValue
	      
	    });
   }
	
	
}

function transformEpochTimestampToDate(epoch_timestamp) {
	
	var myDate = new Date(epoch_timestamp*1000);
	
	return myDate;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function getURLParameter(sParam)
{
	if(window.location.href.indexOf("#")>-1)
	{
		var sPageURL = window.location.href.split("#")[1];
    
    
    	var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	}

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
