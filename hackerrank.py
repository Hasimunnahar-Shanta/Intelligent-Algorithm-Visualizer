import requests
from bs4 import BeautifulSoup

def scrape_problem(problem_slug):
    """
    Fetches title and description for a HackerRank problem given its slug (e.g., "arrays-ds").
    """
    url = f'https://www.hackerrank.com/rest/contests/master/challenges/{problem_slug}/download_pdf'
    resp = requests.get(url)
    resp.raise_for_status()
    # PDF scraping is out of scope; fallback to parsing HTML page description
    html_url = f'https://www.hackerrank.com/challenges/{problem_slug}/problem'
    page = requests.get(html_url)
    page.raise_for_status()
    soup = BeautifulSoup(page.text, 'html.parser')
    title = soup.find('h1', {'class': 'challenge_problem_title'}).text.strip()
    desc_div = soup.find('div', {'class': 'challenge_description'})
    description = ' '.join(p.text.strip() for p in desc_div.find_all('p'))
    return title, description