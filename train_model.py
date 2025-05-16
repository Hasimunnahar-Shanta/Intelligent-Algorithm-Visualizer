import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os

nltk.download('punkt')
nltk.download('stopwords')
cd 
examples = [
    ("Sort an array of integers", "Merge Sort"),
    ("Search for an element in a sorted list", "Binary Search"),
    ("Traverse all nodes in a tree", "Depth-First Search"),
    ("Find the maximum subarray sum", "Kadane's Algorithm"),
    ("Find shortest paths from source in weighted graph", "Dijkstra's Algorithm"),
    ("Find minimum spanning tree of a graph", "Kruskal's Algorithm"),
    ("Check if graph is bipartite", "BFS"),
    ("0/1 Knapsack problem", "Dynamic Programming (Knapsack)"),
    ("Longest increasing subsequence", "Dynamic Programming (LIS)"),
    ("Find connected components in a graph", "Union-Find"),
    ("Find maximum flow in a network", "Ford-Fulkerson Algorithm"),
    ("Search in a rotated sorted array", "Binary Search"),
    ("Multiply large integers efficiently", "Karatsuba Multiplication"),
    ("Detect cycle in a graph", "DFS"),
]
texts, labels = zip(*examples)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english')),
    ('clf', MultinomialNB()),
])

pipeline.fit(texts, labels)

target = os.path.join(os.path.dirname(__file__), 'algorithm_model.pkl')
joblib.dump(pipeline, target)
print(f"Model saved to {target}")