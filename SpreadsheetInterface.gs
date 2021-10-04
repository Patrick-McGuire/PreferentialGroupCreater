classPrefrences = "Class Prefrences";
output = "Output"

function createGroupFromSheet() {
  var configData = getDataFromSheet();
  var bestGroups = getRandomOptimisedGroup(configData)
  bestGroups["scores"] = getGroupsScore(bestGroups, configData);
  var bestGroupsScore = getGroupsScoreFromScores(bestGroups.scores, configData)
  var neg = bestGroupsScore.dislike == 0;
  var start = Date.now();
  for(var i = 0; Date.now() - start < configData.runtime * 1000; i++) {
    var groups = getRandomOptimisedGroup(configData)
    groups["scores"] = getGroupsScore(groups, configData);
    
    var groupsScore = getGroupsScoreFromScores(groups.scores, configData);
    neg = neg || groupsScore.dislike == 0
    if(groupsScore.dislike < bestGroupsScore.dislike) {
      bestGroups = groups;
      bestGroupsScore = groupsScore;
    } else if(groupsScore.dislike <= bestGroupsScore.dislike) {
      if(groupsScore.minLike > bestGroupsScore.minLike) {
        bestGroups = groups;
        bestGroupsScore = groupsScore;
      } else if(groupsScore.minLike >= bestGroupsScore.minLike) {
        if(groupsScore.like > bestGroupsScore.like) {
          bestGroups = groups;
          bestGroupsScore = groupsScore;
        }
      }
    }
  }

  printGroups(bestGroups)
}

// Create the menue when ever the spreadsheet is opened
function onOpen(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Group Maker')
  .addItem('Setup', 'setup')
  .addItem('Generate Groups', 'createGroupFromSheet')
  .addItem('Generate Google Form', 'createForm')
  .addToUi();
}

function printGroups(groups) {
  var dataStruct = []
  for(var i = 0; i < 25; i++) {
    dataStruct.push(["", "", "", "", "", "", "", "", "", "", "", ""]);
  }
  for(var i = 0; i < groups.groupnum; i++) { 
    var activeGroup = groups[""+i]; 
    for(var j = 0; j < activeGroup.length; j++) {
      dataStruct[j+2][i] = activeGroup[j];
    }
    dataStruct[0][i] = "Like: " + groups.scores[""+i].like;
    dataStruct[1][i] = "Dislike: " + groups.scores[""+i].dislike;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  setValues(sheet, output, "B4", "M28", dataStruct);
}

function printFromResponse(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var currentData = getValues(sheet, classPrefrences, "B4", "R62");
  var submitedRow = 0;
  for(var i = 0; i < currentData.length; i++) if(currentData[i][0] == data.person) submitedRow = i + 4
  if(submitedRow == 0) return;
  var dataToPrint = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
  for(var i = 0; i < data.like.length; i++) {
    dataToPrint[i] = data.like[i];
  }
  for(var i = 0; i < data.dislike.length; i++) {
    dataToPrint[i+8] = data.dislike[i];
  }
  setValues(sheet, classPrefrences, "C"+submitedRow, "R"+submitedRow, [dataToPrint])
}

function getDataFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var rawData = getValues(sheet, classPrefrences, "B4", "R62");
  var groupNums = getValue(sheet, classPrefrences, "D2")
  var configData = { "groupnum" : groupNums, "people" : [], }
  configData["runtime"] = getValue(sheet, classPrefrences, "H2")
  for(var i = 0; i < rawData.length; i++) {
    var person = rawData[i][0];
    if(person != "") {
      configData["people"].push(person);
      var teamData = {
        "like" : [],
        "dislike" : []
      }

      for(var j = 1; j <= 8; j++) {
        var personL = rawData[i][j]
        if(personL != "") {
          teamData.like.push(personL)
        }
      }
      for(var j = 9; j <= 16; j++) {
        var personL = rawData[i][j]
        if(personL != "") {
        teamData.dislike.push(personL)
        }
      }
      configData[person] = teamData;
    }
  }

  return configData;
}