import requests
import time
import json

COUNT = 0
# Define the URL and headers
url = "https://www.ratemyprofessors.com/graphql"
headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Authorization": "Basic dGVzdDp0ZXN0",  # Replace with actual authorization token if needed
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Dnt": "1",
    "Host": "www.ratemyprofessors.com",
    "Origin": "https://www.ratemyprofessors.com",
    "Referer": "https://www.ratemyprofessors.com/search/professors/1077?q=*",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/112.0.0.0"
}

# GraphQL query and payload
payload = {
    "query": """
    query TeacherSearchPaginationQuery($count: Int!, $cursor: String, $query: TeacherSearchQuery!) {
        search: newSearch {
            teachers(query: $query, first: $count, after: $cursor) {
                didFallback
                edges {
                    cursor
                    node {
                        id
                        legacyId
                        avgRating
                        numRatings
                        department
                        school {
                            name
                            id
                        }
                        firstName
                        lastName
                        wouldTakeAgainPercent
                        avgDifficulty
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
                resultCount
            }
        }
    }
    """,
    "variables": {
        "count": 8,
        "cursor": "YXJyYXljb25uZWN0aW9uOjA",
        "query": {
            "text": "",
            "schoolID": "U2Nob29sLTEwNzc="
        }
    }
}

# Make the request
# response = requests.post(url, json=payload, headers=headers)

# # Print the response
# if response.status_code == 200:
#     data = response.json()
#     print(data)
# else:
#     print(f"Failed to fetch data. Status code: {response.status_code}")
    
def scrape_rmp_prof_data (url, header, payload, prof_data, count): 
    
    if count == 2:
        store_rmp_prof_data(prof_data)
        print ("last scraped: ", payload['variables']['cursor'])
        return False, prof_data
    print ("scraping: ", payload['variables']['cursor'])
    # Make the request
    
    response = requests.post(url, json=payload, headers=headers)
    
    # Print the response
    if response.status_code == 200:
        data = response.json()
        pageInfo = data['data']['search']['teachers']['pageInfo']
        hasNextPage = pageInfo['hasNextPage']
        nextCursor = pageInfo['endCursor']
        store_rmp_data_locally(data)
        
        # Process prof data 
        profs = data['data']['search']['teachers']['edges']
        for item in profs:
            prof_data.append(item['node'])
        
        
        if (hasNextPage):
            payload['variables']['cursor'] = nextCursor
            time.sleep(1)
            scrape_rmp_prof_data(url, header, payload, prof_data, count+1)
        else :
            print (f"Reach the end of professor list in UCSB at cursor: {nextCursor}")
            store_rmp_prof_data(prof_data)
            return False, prof_data
    else:
        print (f"failed to fetch data from RMP, err: {response.status_code}")
        store_rmp_prof_data(prof_data)
        return False, prof_data

def store_rmp_data_locally(data):
    with open('rmp_temporary_data.json', 'w') as f:
        json.dump(data, f, indent=4)
        
def store_rmp_prof_data(data):
    with open('rmp_prof1.json', 'w') as f:
        json.dump(data, f, indent=4)
        
def main():
    prof_data = []
    hasNextPage, final_prof_data = scrape_rmp_prof_data(url, headers, payload, prof_data, 0)
    if not hasNextPage:
        store_rmp_prof_data(final_prof_data)


if __name__ == "__main__": 
    main()