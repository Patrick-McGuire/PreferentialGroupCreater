function getGroup() {
  getRandomOptimisedGroup(4);
}

function getRandomOptimisedGroup() {
  // Get the data needed
  var configData = getSampleConfigData();
  var people = shuffle(configData.people);
  // Create the data structure
  var groups = { "groupnum" : configData.groupnum }
  for(var i = 0; i < configData.groupnum; i++) { groups[""+i] = []; }
  // Generate the group
  for(var i = 0; i < people.length; i++) {
    var groupNum = getBestGroupForPerson(people[i], groups, configData);
    groups["" + groupNum].push(people[i]);
  }

  return groups;
}

function getBestGroupForPerson(person, groups, configData) {
  var tempData = {};
  for(var i = 0; i < groups.groupnum; i++) {
    if(groups[""+i].length >= Math.ceil(configData.people.length / configData.groupnum)) {
      tempData[""+i] = -1000;
    } else {
      groups[""+i].push(person);
      tempData[""+i] = getGroupScore(groups[""+i], configData);
      groups[""+i].pop();
    }
  }
  var bestScore = -1000;
  var bestScores = [];
  for(var i = 0; i < groups.groupnum; i++) {
    var score = tempData[""+i];
    if(score > bestScore) {
      bestScore = score;
      bestScores = [""+i];
    } else if(score == bestScore) {
      bestScores.push(""+i);
    }
  }
  return shuffle(bestScores)[0];
}

function getGroupsScore(groups, configData){

}

function getGroupScore(groupMembers, configData) {
  var score = 0;
  for(var i = 0; i < groupMembers.length; i++) {
    var name = groupMembers[i];
    var likeNames = configData[name]["like"];
    var dislikeNames = configData[name]["dislike"];
    for(var j = 0; j < likeNames.length; j++) {
      if(groupMembers.includes(likeNames[i])) {
        score += 1;
      }
    }
    for(var j = 0; j < dislikeNames.length; j++) {
      if(groupMembers.includes(dislikeNames[i])) {
        score -= 4;
      }
    }
  }
  return score;
}

// Gets a object with some sample data
function getSampleConfigData() {
  // Sample data
  var data = {
    "groupnum" : 3,
    // All people
    "people" : ["aa" , "bb", "cc", "dd", "ee", "ff", "gg"],
    // Every persons choice
    "aa" : { "like": ["bb", "cc"], "dislike" : ["ff", "dd"] },
    "bb" : { "like": ["bb", "ee"], "dislike" : ["aa"] },
    "cc" : { "like": ["gg", "bb"], "dislike" : ["cc"] },
    "dd" : { "like": ["gg", "aa"], "dislike" : ["dd"] },
    "ee" : { "like": ["dd", "ff"], "dislike" : ["bb"] },
    "ff" : { "like": ["cc", "aa"], "dislike" : ["ee"] },
    "gg" : { "like": ["ff", "ee"], "dislike" : ["gg"] },
  }
  return data;
}

