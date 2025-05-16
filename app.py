from flask import Flask, render_template, request, jsonify, send_file
import joblib
import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from scraper import codeforces, leetcode, hackerrank

app = Flask(__name__)

model = joblib.load(os.path.join('model', 'algorithm_model.pkl'))

def complexity(name):
    mapping = {
        'Merge Sort': ('O(n log n)', 'O(n)'),
        'Binary Search': ('O(log n)', 'O(1)'),
        'Depth-First Search': ('O(|V| + |E|)', 'O(|V|)'),
        "Kadane's Algorithm": ('O(n)', 'O(1)'),
        "Dijkstra's Algorithm": ('O((V+E) log V)', 'O(V)'),
        "Kruskal's Algorithm": ('O(E log E)', 'O(V)'),
        'BFS': ('O(|V| + |E|)', 'O(V)'),
        'Dynamic Programming (Knapsack)': ('O(nW)', 'O(nW)'),
        'Dynamic Programming (LIS)': ('O(n^2)', 'O(n)'),
        'Union-Find': ('O(a(n)) per operation', 'O(n)'),
        'Ford-Fulkerson Algorithm': ('O(max_flow * E)', 'O(V+E)'),
        'Karatsuba Multiplication': ('O(n^log2(3))', 'O(n)'),
        'DFS': ('O(|V| + |E|)', 'O(|V|)'),
    }
    return mapping.get(name, ('Unknown', 'Unknown'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/fetch', methods=['POST'])
def fetch_problem():
    data = request.json
    platform = data.get('platform')
    pid = data.get('pid')
    try:
        if platform == 'codeforces':
            title, desc = codeforces.scrape_problem(pid)
        elif platform == 'leetcode':
            title, desc = leetcode.scrape_problem(pid)
        elif platform == 'hackerrank':
            title, desc = hackerrank.scrape_problem(pid)
        else:
            return jsonify({'error': 'Unknown platform'}), 400
        return jsonify({'title': title, 'description': desc})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    desc = request.json.get('description', '')
    algo = model.predict([desc])[0]
    time_c, space_c = complexity(algo)
    return jsonify({'algorithm': algo, 'time_complexity': time_c, 'space_complexity': space_c})

@app.route('/download_pdf', methods=['POST'])
def download_pdf():
    data = request.json
    title = data.get('title', '')
    desc = data.get('description', '')
    algo = data.get('algorithm', '')
    time_c = data.get('time_complexity', '')
    space_c = data.get('space_complexity', '')

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    p.setFont('Helvetica-Bold', 14)
    p.drawString(50, y, title)
    y -= 30
    p.setFont('Helvetica', 10)
    for line in desc.split(''):
        p.drawString(50, y, line[:80])
        y -= 15
        if y < 100:
            p.showPage()
            y = height - 50
    y -= 10
    p.setFont('Helvetica-Bold', 12)
    p.drawString(50, y, 'Suggested Algorithm: ' + algo)
    y -= 20
    p.setFont('Helvetica', 10)
    p.drawString(50, y, 'Time Complexity: ' + time_c)
    y -= 15
    p.drawString(50, y, 'Space Complexity: ' + space_c)

    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='recommendation.pdf', mimetype='application/pdf')

    buffer.seek(0)
    response = make_response(send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='recommendation.pdf'
    ))
    response.headers['Content-Disposition'] = 'attachment; filename=recommendation.pdf'
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5001)