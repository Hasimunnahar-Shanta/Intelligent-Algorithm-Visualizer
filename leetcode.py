import requests
from bs4 import BeautifulSoup
import json

def scrape_problem(problem_slug):
    """
    Fetches the title and description for a LeetCode problem given its slug (e.g., "two-sum").
    Uses LeetCode's GraphQL API for reliable data retrieval.
    """
    # Define GraphQL query
    api_url = 'https://leetcode.com/graphql'
    query = '''
    query getQuestion($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content
      }
    }
    '''
    variables = {'titleSlug': problem_slug}
    payload = {'query': query, 'variables': variables}

    # Send request
    headers = {
        'Content-Type': 'application/json',
        'Referer': f'https://leetcode.com/problems/{problem_slug}/'
    }
    resp = requests.post(api_url, headers=headers, data=json.dumps(payload))
    resp.raise_for_status()
    data = resp.json()

    # Extract fields
    question = data.get('data', {}).get('question')
    if not question:
        raise ValueError(f"Problem '{problem_slug}' not found or API changed")

    title = question['title']
    html_content = question['content']

    # Clean HTML to text
    soup = BeautifulSoup(html_content, 'html.parser')
    description = soup.get_text(separator=' ').strip()

    return title, description