import json

data = {'data': {'search': {'teachers': {'didFallback': False, 'edges': [{'cursor': 'YXJyYXljb25uZWN0aW9uOjQ4', 'node': {'avgDifficulty': 1.9, 'avgRating': 4.5, 'department': 'Languages', 'firstName': 'Esperanza', 'id': 'VGVhY2hlci00NTgyMzY=', 'lastName': 'Jefferson', 'legacyId': 458236, 'numRatings': 55, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 100}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjQ5', 'node': {'avgDifficulty': 2.9, 'avgRating': 3.8, 'department': 'Art', 'firstName': 'Claudia ', 'id': 'VGVhY2hlci0yMDQ0MzAw', 'lastName': 'Moser', 'legacyId': 2044300, 'numRatings': 55, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 85}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjUw', 'node': {'avgDifficulty': 3.3, 'avgRating': 3.5, 'department': 'Mathematics', 'firstName': 'Maribel', 'id': 'VGVhY2hlci0xMDM4Mzgw', 'lastName': 'Bueno', 'legacyId': 1038380, 'numRatings': 54, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 72.7273}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjUx', 'node': {'avgDifficulty': 3, 'avgRating': 3.7, 'department': 'Art History', 'firstName': 'Jeremy', 'id': 'VGVhY2hlci04OTU2MjM=', 'lastName': 'White', 'legacyId': 895623, 'numRatings': 54, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 65.1163}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjUy', 'node': {'avgDifficulty': 4, 'avgRating': 1.8, 'department': 'Statistics', 'firstName': 'Katherine', 'id': 'VGVhY2hlci0yMzc0MDU1', 'lastName': 'Shatskikh', 'legacyId': 2374055, 'numRatings': 53, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 18.8679}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjUz', 'node': {'avgDifficulty': 3.4, 'avgRating': 3, 'department': 'Ethnic Studies', 'firstName': 'Roberto', 'id': 'VGVhY2hlci03NjI2ODc=', 'lastName': 'Strongman', 'legacyId': 762687, 'numRatings': 52, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 58.8235}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjU0', 'node': {'avgDifficulty': 3.4, 'avgRating': 3.9, 'department': 'History', 'firstName': 'Alice', 'id': 'VGVhY2hlci00MTk2OQ==', 'lastName': "O'Connor", 'legacyId': 41969, 'numRatings': 52, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': 50}}, {'cursor': 'YXJyYXljb25uZWN0aW9uOjU1', 'node': {'avgDifficulty': 2.7, 'avgRating': 4.2, 'department': 'African-American Studies', 'firstName': 'Gaye', 'id': 'VGVhY2hlci04NTY2ODA=', 'lastName': 'Johnson', 'legacyId': 856680, 'numRatings': 51, 'school': {'id': 'U2Nob29sLTEwNzc=', 'name': 'University of California Santa Barbara'}, 'wouldTakeAgainPercent': -1}}], 'pageInfo': {'endCursor': 'YXJyYXljb25uZWN0aW9uOjU1', 'hasNextPage': True}, 'resultCount': 3175}}}}
PROF_DATA = []
pageInfo = data['data']['search']['teachers']['pageInfo']
hasNextPage = pageInfo['hasNextPage']
nextCursor = pageInfo['endCursor']

profs = data['data']['search']['teachers']['edges']

print (pageInfo)
print(hasNextPage)
print(nextCursor)
# print (profs)

for item in profs:
    PROF_DATA.append(item['node'])
print (PROF_DATA)

with open ('test_json.json', 'w') as f:
    json.dump(PROF_DATA, f, indent=4)
    
with open ('rmp_prof.json', 'r') as f:
    content = json.load(f)
    print (len(content))