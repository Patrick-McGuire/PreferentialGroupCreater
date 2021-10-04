var badScore = 4;
var goodScore = 1;

function getGroup() {
  getRandomOptimisedGroup(getSampleConfigData());
}

function getRandomOptimisedGroup(configData) {
  // Get the data needed
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
    if(!spaceInGroup(groups, i, configData)) {
      tempData[""+i] = -1000;
    } else {
      tempData[""+i] = getAddPersonScore(groups[""+i], configData, person);
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

function spaceInGroup(groups, group, configData) {
  // Get the data we need
  var peopleCount = configData.people.length;
  var groupNum = configData.groupnum;
  var maxGroupNum = Math.ceil(peopleCount / groupNum);
  var minGroupNum = Math.floor(peopleCount / groupNum);
  // If groups size is less than min group size, return early
  if(groups[""+group].length < minGroupNum) return true;
  if(groups[""+group].length >= maxGroupNum) return false;
  // Calculate the number of max groups we can have
  var maxMaxGroupCount = peopleCount - (minGroupNum * groupNum);
  // Claculate the number of max group 
  var maxGroupCount = 0
  for(var i = 0; i < groupNum; i++) {
    if(groups[""+i].length >= maxGroupNum) {
      maxGroupCount++;
    }
  }
  return maxGroupCount < maxMaxGroupCount;
}

function getAddPersonScore(groupMembers, configData, person) {
  var score = 0;
  for(var i = 0; i < groupMembers.length; i++) {
    var name = groupMembers[i];
    var likeNames = configData[name].like;
    var dislikeNames = configData[name].dislike;
    for(var j = 0; j < likeNames.length; j++) {
      if(likeNames[j] == person) {
        score += goodScore;
      }
    }
    for(var j = 0; j < dislikeNames.length; j++) {
      if(dislikeNames[j] == person) {
        score -= badScore;
      }
    }
  }
  
  var likeNames = configData[person].like;
  var dislikeNames = configData[person].dislike;
  for(var j = 0; j < likeNames.length; j++) {
    if(groupMembers.includes(likeNames[j])) {
      score += goodScore;
    }
  }
  for(var j = 0; j < dislikeNames.length; j++) {
    if(groupMembers.includes(dislikeNames[j])) {
      score -= badScore;
    }
  }
  return score;
}

function getGroupsScoreFromScores(scores, configData) {
  var score = {"minLike" : 1000, "like" : 0, "dislike" : 0 };
  for(var i = 0; i < configData.groupnum; i++) {
    if(scores[""+i].like < score.minLike) {
      score.minLike = scores[""+i].like;
    }
    score.like += scores[""+i].like;
    score.dislike += scores[""+i].dislike;
  }
  return score;
}
function getGroupsScore(groups, configData){
  var scores = {}
  for(var i = 0; i < groups.groupnum; i++) { 
    var activeGroup = groups[""+i]; 
    scores[""+i] = getGroupScore(activeGroup, configData)
  }
  return scores;
}

function getGroupScore(groupMembers, configData) {
  var score = {"like" : 0, "dislike" : 0 };
  for(var i = 0; i < groupMembers.length; i++) {
    var name = groupMembers[i];
    var likeNames = configData[name]["like"];
    var dislikeNames = configData[name]["dislike"];
    for(var j = 0; j < likeNames.length; j++) {
      if(groupMembers.includes(likeNames[j])) {
        score.like++;
        break;
      }
    }
    for(var j = 0; j < dislikeNames.length; j++) {
      if(groupMembers.includes(dislikeNames[j])) {
        score.dislike++;
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
    "bb" : { "like": ["cc", "ee"], "dislike" : ["aa"] },
    "cc" : { "like": ["gg", "bb"], "dislike" : ["cc"] },
    "dd" : { "like": ["gg", "aa"], "dislike" : [] },
    "ee" : { "like": ["dd", "ff"], "dislike" : ["bb"] },
    "ff" : { "like": ["cc", "aa"], "dislike" : ["ee"] },
    "gg" : { "like": ["ff", "ee"], "dislike" : ["aa"] },
  }
  return data;
}

