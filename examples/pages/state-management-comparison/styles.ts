export const comparisonStyles = `
.comparison-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-bar {
  border-bottom: 2px solid #e1e5e9;
  margin-bottom: 20px;
}

.tab-button {
  background: none;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: 500;
}

.tab-button.active {
  border-bottom-color: #007acc;
  color: #007acc;
}

.counters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .counters-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

.counter-section {
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  background: #fafbfc;
}

.counter-section h2 {
  margin: 0 0 15px 0;
  color: #24292e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.counter-display {
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0;
  color: #24292e;
}

.loading {
  font-size: 14px;
  color: #f39c12;
  margin-left: 10px;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.button-group button {
  padding: 8px 16px;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.button-group button:hover:not(:disabled) {
  background: #f6f8fa;
  border-color: #1b1f23;
}

.button-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-group {
  margin: 15px 0;
}

.input-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  font-size: 14px;
}

.info {
  font-size: 14px;
  color: #586069;
  margin: 10px 0;
}

.code-preview {
  margin-top: 15px;
}

.code-preview details {
  cursor: pointer;
}

.code-preview summary {
  color: #0366d6;
  font-size: 14px;
  padding: 5px 0;
}

.code-preview pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  color: #24292e;
  margin: 10px 0;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.comparison-table th,
.comparison-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e1e5e9;
}

.comparison-table th {
  background: #f6f8fa;
  font-weight: 600;
  color: #24292e;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.pros, .cons {
  padding: 16px;
  border-radius: 6px;
}

.pros {
  background: #d4edda;
  border-left: 4px solid #28a745;
}

.cons {
  background: #f8d7da;
  border-left: 4px solid #dc3545;
}

.pros h4, .cons h4 {
  margin: 0 0 10px 0;
  color: #24292e;
}

.pros ul, .cons ul {
  margin: 0;
  padding-left: 20px;
}

.pros li, .cons li {
  margin: 5px 0;
  color: #24292e;
}
` 