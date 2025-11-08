import './Graph.css';

interface GraphProps {
  equation: string;
  type: 'quadratic' | 'linear' | 'exponential';
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  highlightPoints?: Array<{ x: number; y: number; label?: string }>;
  showGrid?: boolean;
  hideEquation?: boolean;
}

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
}: GraphProps) => {
  const width = 600;
  const height = 400;
  const padding = 40;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Convert graph coordinates to SVG coordinates
  const xToSVG = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
  const yToSVG = (y: number) => padding + ((yMax - y) / (yMax - yMin)) * graphHeight;

  // Generate points for the function
  const generatePoints = () => {
    const points: Array<{ x: number; y: number }> = [];
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
  const gridLines = [];
  if (showGrid) {
    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x !== 0) {
        gridLines.push(
          <line
            key={`v-${x}`}
            x1={xToSVG(x)}
            y1={padding}
            x2={xToSVG(x)}
            y2={height - padding}
            stroke="#e0e6ed"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      }
    }
    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y !== 0) {
        gridLines.push(
          <line
            key={`h-${y}`}
            x1={padding}
            y1={yToSVG(y)}
            x2={width - padding}
            y2={yToSVG(y)}
            stroke="#e0e6ed"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      }
    }
  }

  // X and Y axes
  const xAxisY = yToSVG(0);
  const yAxisX = xToSVG(0);

  return (
    <div className="graph-container">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="graph-svg"
      >
        {/* Grid lines */}
        {gridLines}

        {/* X-axis */}
        <line
          x1={padding}
          y1={xAxisY}
          x2={width - padding}
          y2={xAxisY}
          stroke="#1e3a5f"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />

        {/* Y-axis */}
        <line
          x1={yAxisX}
          y1={padding}
          x2={yAxisX}
          y2={height - padding}
          stroke="#1e3a5f"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#1e3a5f" />
          </marker>
        </defs>

        {/* Function curve */}
        <path
          d={pathData}
          fill="none"
          stroke="#6b7fd7"
          strokeWidth="3"
          className="function-curve"
        />

        {/* Highlight points */}
        {highlightPoints.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={xToSVG(point.x)}
              cy={yToSVG(point.y)}
              r="6"
              fill="#6b7fd7"
              stroke="#fff"
              strokeWidth="2"
              className="highlight-point"
            />
            {point.label && (
              <text
                x={xToSVG(point.x)}
                y={yToSVG(point.y) - 15}
                textAnchor="middle"
                fill="#1e3a5f"
                fontSize="12"
                fontWeight="600"
                className="point-label"
              >
                {point.label}
              </text>
            )}
            <text
              x={xToSVG(point.x)}
              y={yToSVG(point.y) + 25}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
              className="point-coords"
            >
              ({point.x}, {point.y})
            </text>
          </g>
        ))}

        {/* Axis labels */}
        {Array.from({ length: Math.floor(xMax) - Math.ceil(xMin) + 1 }, (_, i) => {
          const x = Math.ceil(xMin) + i;
          if (x === 0) return null;
          return (
            <text
              key={`x-label-${x}`}
              x={xToSVG(x)}
              y={xAxisY + 20}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontWeight="500"
            >
              {x}
            </text>
          );
        })}

        {Array.from({ length: Math.floor(yMax) - Math.ceil(yMin) + 1 }, (_, i) => {
          const y = Math.ceil(yMin) + i;
          if (y === 0) return null;
          return (
            <text
              key={`y-label-${y}`}
              x={yAxisX - 15}
              y={yToSVG(y) + 4}
              textAnchor="end"
              fill="#64748b"
              fontSize="11"
              fontWeight="500"
            >
              {y}
            </text>
          );
        })}

        {/* Axis origin label */}
        <text
          x={yAxisX - 15}
          y={xAxisY + 20}
          textAnchor="end"
          fill="#64748b"
          fontSize="11"
          fontWeight="500"
        >
          0
        </text>

        {/* Axis labels */}
        <text
          x={width - padding + 10}
          y={xAxisY + 4}
          fill="#1e3a5f"
          fontSize="12"
          fontWeight="600"
        >
          x
        </text>
        <text
          x={yAxisX + 4}
          y={padding - 10}
          fill="#1e3a5f"
          fontSize="12"
          fontWeight="600"
        >
          y
        </text>
      </svg>
      {!hideEquation && (
        <div className="graph-equation">
          f(x) = {equation}
        </div>
      )}
    </div>
  );
};

export default Graph;
