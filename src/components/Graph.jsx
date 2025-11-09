
const Graph = ({ 
  equation, 
  type = 'quadratic',
  xMin = -2,
  xMax = 6,
  yMin = -3,
  yMax = 5,
  highlightPoints = [],
  showGrid = true,
  hideEquation = false,
}) => {
  const width = 600;
  const height = 400;
  const padding = 40;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Convert graph coordinates to SVG coordinates
  const xToSVG = (x) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
  const yToSVG = (y) => padding + ((yMax - y) / (yMax - yMin)) * graphHeight;

  // Generate points for the function
  const generatePoints = () => {
    const points = [];
    const steps = 200;
    
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      let y = 0;
      
      if (type === 'quadratic') {
        // General quadratic parser: ax^2 + bx + c
        const cleanedEquation = equation.replace(/\s/g, '').replace(/\*/g, '');
        const match = cleanedEquation.match(/([+-]?\d*\.?\d*)x\^2([+-]?\d*\.?\d*)x([+-]?\d*\.?\d*)/);
        if (match) {
          const a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
          const b = match[2] === '' || match[2] === '+' ? 1 : match[2] === '-' ? -1 : parseFloat(match[2]);
          const c = match[3] ? parseFloat(match[3]) : 0;
          y = a * x * x + b * x + c;
        }
      } else if (type === 'linear' && equation.includes('x')) {
        // Simple linear: y = mx + b format
        const match = equation.match(/([+-]?\d*)x\s*([+-]?\d*)/);
        if (match) {
          const m = match[1] ? parseFloat(match[1]) : 1;
          const b = match[2] ? parseFloat(match[2]) : 0;
          y = m * x + b;
        }
      } else if (type === 'exponential') {
        // Exponential parser: a*b^x or a*e^(bx) format
        const cleanedEquation = equation.replace(/\s/g, '');
        
        console.log(`Parsing exponential: "${equation}" -> "${cleanedEquation}"`);
        
        // Try b^x format first (e.g., "2^x", "3^x")
        let match = cleanedEquation.match(/^(\d+\.?\d*)\^x$/);
        if (match) {
          const b = parseFloat(match[1]);
          console.log(`Matched b^x format: b=${b}, calculating ${b}^${x} = ${Math.pow(b, x)}`);
          y = Math.pow(b, x);
        } else {
          // Try a*b^x format (e.g., "2*3^x")
          match = cleanedEquation.match(/^(\d+\.?\d*)\*(\d+\.?\d*)\^x$/);
          if (match) {
            const a = parseFloat(match[1]);
            const b = parseFloat(match[2]);
            console.log(`Matched a*b^x format: a=${a}, b=${b}`);
            y = a * Math.pow(b, x);
          } else {
            // Try e^x or e^(ax) format
            match = cleanedEquation.match(/^(\d*\.?\d*)\*?e\^\(?(\d*\.?\d*)x?\)?$/);
            if (match) {
              const a = match[1] ? parseFloat(match[1]) : 1;
              const b = match[2] ? parseFloat(match[2]) : 1;
              console.log(`Matched e^(ax) format: a=${a}, b=${b}`);
              y = a * Math.exp(b * x);
            } else {
              console.warn(`Could not parse exponential equation: ${cleanedEquation}`);
            }
          }
        }
      }
      
      if (y >= yMin && y <= yMax) {
        points.push({ x, y });
      }
    }
    
    return points;
  };

  const points = generatePoints();
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xToSVG(p.x)} ${yToSVG(p.y)}`)
    .join(' ');

  // Generate grid lines
  const gridLines = () => {
    if (!showGrid) return null;

    const lines = [];

    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const xPos = xToSVG(x);
      lines.push(
        <line
          key={`v-${x}`}
          x1={xPos}
          y1={padding}
          x2={xPos}
          y2={height - padding}
          stroke="#eee"
          strokeWidth="1"
        />
      );
      // x-axis labels
      if (x !== 0) {
        lines.push(
          <text key={`v-label-${x}`} x={xPos} y={height - padding + 20} fontSize="10" textAnchor="middle" fill="#666">
            {x}
          </text>
        );
      }
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const yPos = yToSVG(y);
      lines.push(
        <line
          key={`h-${y}`}
          x1={padding}
          y1={yPos}
          x2={width - padding}
          y2={yPos}
          stroke="#eee"
          strokeWidth="1"
        />
      );
      if (y !== 0) {
        lines.push(
          <text key={`h-label-${y}`} x={padding - 10} y={yPos + 3} fontSize="10" textAnchor="end" fill="#666">
            {y}
          </text>
        );
      }
    }

    return lines;
  };

  // Axes
  const axes = () => {
    const yAxisX = xToSVG(0);
    const xAxisY = yToSVG(0);

    return (
      <g>
        {/* X-axis */}
        <line x1={padding} y1={xAxisY} x2={width - padding} y2={xAxisY} stroke="#999" strokeWidth="2" />
        {/* Y-axis */}
        <line x1={yAxisX} y1={padding} x2={yAxisX} y2={height - padding} stroke="#999" strokeWidth="2" />
        {/* Axis labels */}
        <text x={width - padding + 10} y={xAxisY + 5} fontSize="12" fill="#333">x</text>
        <text x={yAxisX - 5} y={padding - 10} fontSize="12" textAnchor="end" fill="#333">y</text>
      </g>
    );
  };

  // Highlight points (e.g., vertex)
  const renderHighlights = () => {
    return highlightPoints.map((p, i) => (
      <g key={i}>
        <circle cx={xToSVG(p.x)} cy={yToSVG(p.y)} r="4" fill="#6b7fd7" />
        {p.label && (
          <text x={xToSVG(p.x) + 8} y={yToSVG(p.y) - 8} fontSize="12" fill="#6b7fd7">{p.label}</text>
        )}
      </g>
    ));
  };

  return (
    <div className="graph-container">
      {!hideEquation && (
        <div className="equation-display">
          <code>
            {type === 'quadratic' ? 'y = ' : type === 'linear' ? 'y = ' : 'y = '}
            {equation}
          </code>
        </div>
      )}

      <svg width={width} height={height} className="graph-svg">
        {/* Grid */}
        {gridLines()}
        {/* Axes */}
        {axes()}
        {/* Function Path */}
        <path d={pathData} fill="none" stroke="#6b7fd7" strokeWidth="2" />
        {/* Highlight points */}
        {renderHighlights()}
      </svg>
    </div>
  );
};

export default Graph;
