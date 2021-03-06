/**
 * Called by edX to initialize the xblock.
 * @param runtime - provided by EdX
 * @param element - provided by EdX
 */
function Initialize_CTATXBlock(runtime, element) {
    var post = {
	save_problem_state: function(state) {
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_save_problem_state'),
		    data: JSON.stringify({state:state}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"});
	},
	report_grade: function(correct_step_count, total_step_count) {
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_grade'),
		    data: JSON.stringify({'value': correct_step_count,
					  'max_value': total_step_count}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"});
	},
	log_event: function(aMessage) {
	    msg = JSON.stringify({
		'event_type': 'ctat_log',
		'action': 'CTATlogevent',
		'message': aMessage});
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_log'),
		    data: msg,
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(data1){
			if(data1['result']==='success'){
				//alert("Edx");
				var settings = {
  					"async": true,
  					"crossDomain": true,
					"url": "http://10.202.210.193:8080/SimStudentServlet/serv",
  					"method": "POST",
  					"headers": {
    						"content-type": "application/xml"
  					},
  					"data": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType><transaction_id>ce84270a-f527-0988-c717-3c817ed4c127</transaction_id><Selection><value>ans_table_c4</value></Selection><Action><value>UpdateTextField</value></Action><Input><value><![CDATA[q]]></value></Input><session_id>e4917311-1063-9039-0e2a-da492e969f60</session_id></properties></message>"
				}
				$.ajax(settings).done(function (response) {
  					alert(response);
				});
			}
		    }});
	},
	report_skills: function(skills) {
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_save_skills'),
		    data: JSON.stringify({'skills': skills}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"});
	}
    };
    $('.ctatxblock').on("load", function() {
	var ctattutor = new URL(this.src);
	// put problem state in config
	this.contentWindow.postMessage(CTATConfig, ctattutor.origin);

	window.addEventListener("message", function(event) {
	    if (event.origin !== ctattutor.origin) {
		console.log("Message not from valid source:", event.origin,
			    "Expected:", ctatttuor.origin);
		return;
	    }
	    switch (event.data.action) {
	    case "save_problem_state":
		post.save_problem_state(event.data.input);
		break;
	    case "grade":
		post.report_grade(event.data.input.value, event.data.input.max);
		break;
	    case "log":
		post.log_event(event.data.input);
		break;
	    case "skills":
		post.report_skills(event.data.input);
		break;
	    default:
		console.log("unrecognized action:", event.data.action);
		break;
	    }
	}, false);
    });
}
