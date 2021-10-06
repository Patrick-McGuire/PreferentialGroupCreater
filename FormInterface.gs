classPrefrences = "Class Prefrences";
var yourNameQuestion = "Enter your name:"
var dislikeQuestion = "Enter a person you don't work well with:"
var likeQuestion = 'Enter a person you would like to work with:'

function createForm() {
  // Get the data needed from the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var dislikeCount = getValue(sheet, classPrefrences, "R2");
  var likeCount = getValue(sheet, classPrefrences, "M2");
  var people1 = getValues(sheet, classPrefrences, "B4", "B62")
  var people = []
  for(var i = 0; i < people1.length; i++) if(people1[i][0] != "") people.push(people1[i][0])

  // Create the form
  var form = FormApp.create('Group Preferences');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId())
  form.addListItem()
    .setTitle(yourNameQuestion)
    .setChoiceValues(people)
  
  form.addSectionHeaderItem()
    .setTitle('People you would like to work with');

  for(var i = 0; i < likeCount; i++) {
    form.addListItem()
    .setTitle(likeQuestion)
    .setChoiceValues(people)
  }

  form.addSectionHeaderItem()
    .setTitle('People you would rather not work with');
    
  for(var i = 0; i < dislikeCount; i++) {
    form.addListItem()
    .setTitle(dislikeQuestion)
    .setChoiceValues(people)
  }
  ScriptApp.newTrigger('onFormSubmitCustom')
    .forForm(form)
    .onFormSubmit()
    .create();

  openUrl(form.getPublishedUrl());
}

function onFormSubmitCustom(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  // Data we need to get
  var person = ""
  var dislike = []
  var like = []
  // Get all the data into the above structure
  for(var i = 0; i < itemResponses.length; i++) {
    var question = itemResponses[i].getItem().getTitle();
    var answer = itemResponses[i].getResponse()
    if(question == yourNameQuestion) {
      if(answer != "") person = answer;
    } else if(question == dislikeQuestion) {
      if(answer != "") dislike.push(answer);
    } else if(question == likeQuestion) {
      if(answer != "") like.push(answer)
    }
  }
  printFromResponse( { "person" : person, "like" : like, "dislike" : dislike } );
}



