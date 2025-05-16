import requests
from bs4 import BeautifulSoup

def scrape_problem(problem_id):
    """
    Fetches the title and statement for a Codeforces problem given its ID (e.g., "141A").
    """
    url = f'https://codeforces.com/problemset/problem/{problem_id}'
    resp = requests.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    title = soup.find('div', class_='title').text.strip()
    statement_div = soup.find('div', class_='problem-statement')
    # Remove interactive elements
    for elem in statement_div.select('.input, .output, .time-limit, .memory-limit'):
        elem.decompose()
    description = ' '.join(p.text.strip() for p in statement_div.find_all('p'))
    return title, description