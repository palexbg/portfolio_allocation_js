// ------------------------------------------------------------
QUnit.module('Optimisation internal module', {
  before: function() {
    // 
  }
});


QUnit.test('Unidimensional minimization - Golden section search method', function(assert) {    	
	// Error cases
	{
		// Define the function x -> x^2
		var f = function(x) {
			return x*x;
		}
		
		//
		assert.throws(function() { PortfolioAllocation.goldenSectionSearch_(f, 2, 1) },
							       new Error('bracketing interval lower bound 2 greater than bracketing interval upper bound 1'),
								  "Error case, bracketing interval lower bound greater than upper bound");
	}
	
	// Limit cases
	{
		// Define the function x -> x
		var f = function(x) {
			return Math.abs(x);
		}

		//
		var expectedSol = 0;
		var expectedValueSol = f(expectedSol);

		var sol = PortfolioAllocation.goldenSectionSearch_(f, 0, 1);
		assert.equal(Math.abs(sol[0] - expectedSol) <= 1e-6, true, 'Limit case, bracketing interval lower bound equal to the minimum');
		assert.equal(Math.abs(sol[1] - expectedValueSol) <= 1e-6, true, 'Limit case, bracketing interval lower bound equal to the minimum, value');
		assert.equal(sol.length, 2, 'Limit case, bracketing interval lower bound equal to the minimum, number of elements');

		var sol = PortfolioAllocation.goldenSectionSearch_(f, -1, 0);
		assert.equal(Math.abs(sol[0] - expectedSol) <= 1e-6, true, 'Limit case, bracketing interval upper bound equal to the minimum');
		assert.equal(Math.abs(sol[1] - expectedValueSol) <= 1e-6, true, 'Limit case, bracketing interval upper bound equal to the minimum, value');
		assert.equal(sol.length, 2, 'Limit case, bracketing interval upper bound equal to the minimum number of elements');
	}
	
	// Static test 1
	{
		// Define the function x -> (x-2)^2
		var f = function(x) {
			return (x-2)*(x-2);
		}
		
		//
		var expectedSol = 2;
		var expectedValueSol = f(expectedSol);

		var defaultPrecisionSol = PortfolioAllocation.goldenSectionSearch_(f, 1, 5);
		assert.equal(Math.abs(defaultPrecisionSol[0] - expectedSol) <= 1e-6, true, 'Test function 1, default precision');
		assert.equal(Math.abs(defaultPrecisionSol[0] - expectedSol) > 1e-8, true, 'Test function 1, default precision');
		assert.equal(Math.abs(defaultPrecisionSol[1] - expectedValueSol) <= 1e-6, true, 'Test function 1, default precision, value');
		assert.equal(sol.length, 2, 'Test function 1, default precision, number of elements');
		
		var HighPrecisionSol = PortfolioAllocation.goldenSectionSearch_(f, 1, 5, {eps: 1e-8});
		assert.equal(Math.abs(HighPrecisionSol[0] - expectedSol) <= 1e-8, true, 'Test function 1, high precision');
		assert.equal(Math.abs(HighPrecisionSol[1] - expectedValueSol) <= 1e-8, true, 'Test function 1, high precision, value');
		assert.equal(sol.length, 2, 'Test function 1, high precision, number of elements');
	}
	
	// Static test 2
	{
		// Define the function x -> x^4 - 14x^3 + 60x^2 - 70x, unimodal on [0,2]
		var f = function(x) {
			return Math.pow(x, 4) - 14*Math.pow(x, 3) + 60*Math.pow(x,2) - 70*x;
		}
		
		//
		var expectedSol = 0.7809;
		var expectedValueSol = f(expectedSol);

		var sol = PortfolioAllocation.goldenSectionSearch_(f, 0, 2);
		assert.equal(Math.abs(sol[0] - expectedSol) <= 1e-4, true, 'Test function 2');
		assert.equal(Math.abs(sol[1] - expectedValueSol) <= 1e-4, true, 'Test function 2, value');
		assert.equal(sol.length, 2, 'Test function 2, number of elements');
	}
	
	// Static test 3
	{
		// Define the function x -> exp(-x) - cos(x), unimodal on [0,1]
		var f = function(x) {
			return Math.exp(-x) - Math.cos(x);
		}
		
		//
		var expectedSol = 0.588533;
		var expectedValueSol = f(expectedSol);

		var sol = PortfolioAllocation.goldenSectionSearch_(f, 0, 1);
		assert.equal(Math.abs(sol[0] - expectedSol) <= 1e-5, true, 'Test function 3, minimum in open interval');
		assert.equal(Math.abs(sol[1] - expectedValueSol) <= 1e-5, true, 'Test function 3, minimum in open interval, value');
		assert.equal(sol.length, 2, 'Test function 3, minimum in open interval, number of elements');
		
		//
		var expectedSol = 0.4;
		var expectedValueSol = f(expectedSol);

		var sol = PortfolioAllocation.goldenSectionSearch_(f, 0, 0.4);
		assert.equal(Math.abs(sol[0] - expectedSol) <= 1e-6, true, 'Test function 3, bracketing interval lower bound equal to the minimum');
		assert.equal(Math.abs(sol[1] - expectedValueSol) <= 1e-6, true, 'Test function 3, bracketing interval lower bound equal to the minimum, value');
		assert.equal(sol.length, 2, 'Test function 3, bracketing interval lower bound equal to the minimum, number of elements');

	}
});



QUnit.test('Unidimensional root finding - Bisection method', function(assert) {    	
	// Error cases
	{
		// Define the function x -> x^2
		var f = function(x) {
			return x*x;
		}
		
		//
		assert.throws(function() { PortfolioAllocation.bisection_(f, 2, 1) },
							       new Error('bracketing interval lower bound 2 greater than bracketing interval upper bound 1'),
								  "Error case, bracketing interval lower bound greater than upper bound");

		//
		assert.throws(function() { PortfolioAllocation.bisection_(f, 1, 2) },
							       new Error('interval [1,2] is not a bracketing interval'),
								  "Error case, not a bracketing interval");
	}
	
	// Limit cases
	{
		// Define the function x -> x
		var f = function(x) {
			return x;
		}

		//
		var expectedSol = 0;

		var sol = PortfolioAllocation.bisection_(f, 0, 1);
		assert.equal(Math.abs(sol - expectedSol) <= 1e-6, true, 'Limit case, bracketing interval lower bound equal to a root');

		var sol = PortfolioAllocation.bisection_(f, -1, 0);
		assert.equal(Math.abs(sol - expectedSol) <= 1e-6, true, 'Limit case, bracketing interval upper bound equal to a root');

		var sol = PortfolioAllocation.bisection_(f, -1, 1);
		assert.equal(Math.abs(sol - expectedSol) <= 1e-6, true, 'Limit case, bracketing interval halving point equal to a root');
	}
	
	// Static test 1, simple root
	{
		// Define the function x ->  x^2 - 2
		var f = function(x) {
			return x*x - 2;
		}
		
		//
		var expectedSol = Math.sqrt(2);

		var defaultPrecisionSol = PortfolioAllocation.bisection_(f, 0, 2);
		assert.equal(Math.abs(defaultPrecisionSol - expectedSol) <= 1e-6, true, 'Test function 1, default precision');
		
		var HighPrecisionSol = PortfolioAllocation.bisection_(f, 0, 2, {eps: 1e-12});
		assert.equal(Math.abs(HighPrecisionSol - expectedSol) <= 1e-12, true, 'Test function 1, high precision');
	}
	
	// Static test 2, double root
	{
		// Define the function x ->  (x-1)^2 * (x-0.5)
		var f = function(x) {
			return (x-1)*(x-1)*(x-0.5);
		}
		
		//
		var expectedSol = 1;
		
		var sol = PortfolioAllocation.bisection_(f, 0, 2);
		assert.equal(Math.abs(sol - expectedSol) <= 1e-6, true, 'Test function 2');
	}
	
	// Static test 3
	{
		// Define the function x ->  1/1.22^(1/x) + 1/4.33^(1/x) - 1
		var f = function(x) {
			return Math.pow(1/1.22, 1/x) + Math.pow(1/4.33, 1/x) - 1;
		}
		
		//
		var expectedSol = 0.904;
		
		var sol = PortfolioAllocation.bisection_(f, 0.001, 1);
		assert.equal(Math.abs(sol - expectedSol) <= 1e-3, true, 'Test function 3');
	}
});



QUnit.test('Optimization problems solver - Threshold Accepting', function(assert) {    	
	// C.f. testFuntions method of NMOF R package
	
	// Test function Ackley 
	{
		// Define n
		var n = 25;
		
		// Define the function
		var f = function(x) {
			// Dimension of the problem
			var n = x.length;
			
			var sum_x_sq = 0;
			for (var i = 0; i < n; ++i) {
				sum_x_sq += x[i] * x[i];
			}
			
			var sum_cos = 0;
			for (var i = 0; i < n; ++i) {
				sum_cos += Math.cos(2 * Math.PI *x[i]);
			}
			
			var res = Math.exp(1) + 20 - 20*Math.exp(-0.2 * Math.sqrt(1/n * sum_x_sq)) - Math.exp(1/n * sum_cos);
			
			return res;
		}
		
		// The minimum of the function f is attained at (0,...,0) and is equal to 0
		var expectedSol = new Array(n);
		for (var i = 0; i < n; ++i) {
			expectedSol[i] = 0;
		}
		var expectedSolValue = 0;
		
		// Define the initial point: (-0.5,...,-0.5)
		var x0 = new Array(n);
		for (var i = 0; i < n; ++i) {
			x0[i] = -0.5;
		}
		
		// Define the lower and upper bounds: [-32, 32]^n
		var lowerBounds = new Array(n);
		var upperBounds = new Array(n);
		for (var i = 0; i < n; ++i) {
			lowerBounds[i] = -32;
			upperBounds[i] = 32;
		}
		
		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-2, true, 'Test function Ackley, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-2, true, 'Test function Ackley, optimal function value');
	}
	
	// Test function Eggholder
	{
		// Define the function
		var f = function(x) {
			return -(x[1] + 47) * Math.sin(Math.sqrt(Math.abs(x[1] + x[0]/2 + 47))) - x[0] * Math.sin(Math.sqrt(Math.abs(x[0] - (x[1] + 47))));
		}
		
		// The minimum of the function f is attained at (512, 404.2319) and is equal to -959.6407
		var expectedSol = [512, 404.2319];
		var expectedSolValue = -959.6407;
		
		// Define the initial point: (500, 400)
		var x0 = [500, 400];

		// Define the lower and upper bounds: [-512, 512]^2
		var lowerBounds = [-512, -512];
		var upperBounds = [512, 512];
		
		// Compute the minimum of the function f
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {nSteps: 10000, neighbourGeneratorParameters: { alpha: 0.1, 
		                                                                                                              lowerBounds: lowerBounds, 
		                                                                                                              upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-2, true, 'Test function Eggholder, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-2, true, 'Test function Eggholder, optimal function value');
	}
	
	// Test function Griewank
	{
		// Define n
		var n = 25;
		
		// Define the function
		var f = function(x) {
			// Dimension of the problem
			var n = x.length;
			
			var sum_x_sq = 0;
			for (var i = 0; i < n; ++i) {
				sum_x_sq += x[i] * x[i];
			}
			
			var prod_cos = 1;
			for (var i = 0; i < n; ++i) {
				prod_cos *= Math.cos(x[i]/Math.sqrt(i+1));
			}
			
			var res = 1 + 1/4000 * sum_x_sq - prod_cos;
			
			return res;
		}
		
		// The minimum of the function f is attained at (0,...,0) and is equal to 0
		var expectedSol = new Array(n);
		for (var i = 0; i < n; ++i) {
			expectedSol[i] = 0;
		}
		var expectedSolValue = 0;
		
		// Define the initial point: (-0.5,...,-0.5)
		var x0 = new Array(n);
		for (var i = 0; i < n; ++i) {
			x0[i] = -0.5;
		}
		
		// Define the lower and upper bounds: [-1, 1]^n
		var lowerBounds = new Array(n);
		var upperBounds = new Array(n);
		for (var i = 0; i < n; ++i) {
			lowerBounds[i] = -1;
			upperBounds[i] = 1;
		}
		
		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-2, true, 'Test function Griewank, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-2, true, 'Test function Griewank, optimal function value');
	}
	
	// Test function Rastrigin
	{
		// Define n
		var n = 25;
		
		// Define the function
		var f = function(x) {
			// Dimension of the problem
			var n = x.length;
			
			var sum = 0;
			for (var i = 0; i < n; ++i) {
				sum += x[i] * x[i] - 10 * Math.cos(2*Math.PI*x[i]);
			}

			var res = 10 * n + sum;
			
			return res;
		}
		
		// The minimum of the function f is attained at (0,...,0) and is equal to 0
		var expectedSol = new Array(n);
		for (var i = 0; i < n; ++i) {
			expectedSol[i] = 0;
		}
		var expectedSolValue = 0;
		
		// Define the initial point: (0.1,...,0.1)
		var x0 = new Array(n);
		for (var i = 0; i < n; ++i) {
			x0[i] = 0.1;
		}
		
		// Define the lower and upper bounds: [-5.12, 5.12]^n
		var lowerBounds = new Array(n);
		var upperBounds = new Array(n);
		for (var i = 0; i < n; ++i) {
			lowerBounds[i] = -5.12;
			upperBounds[i] = 5.12;
		}
		
		// Compute the minimum of the function f
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-1, true, 'Test function Rastrigin, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-1, true, 'Test function Rastrigin, optimal function value');
	}
	
	// Test function Rosenbrock
	{
		// Define n
		var n = 25;
		
		// Define the function
		var f = function(x) {
			// Dimension of the problem
			var n = x.length;
			
			var sum = 0;
			for (var i = 0; i < n-1; ++i) {
				sum += 100*(x[i+1] - x[i]*x[i])*(x[i+1] - x[i]*x[i]) + (1-x[i])*(1-x[i])
			}

			var res = sum;
			
			return res;
		}
		
		// The minimum of the function f is attained at (1,...,1) and is equal to 0
		var expectedSol = new Array(n);
		for (var i = 0; i < n; ++i) {
			expectedSol[i] = 1;
		}
		var expectedSolValue = 0;
		
		// Define the initial point: (0.9,...,0.9)
		var x0 = new Array(n);
		for (var i = 0; i < n; ++i) {
			x0[i] = 0.9;
		}
		
		// Define the lower and upper bounds: [-5, 5]^n
		var lowerBounds = new Array(n);
		var upperBounds = new Array(n);
		for (var i = 0; i < n; ++i) {
			lowerBounds[i] = -5;
			upperBounds[i] = 5;
		}
		
		// Compute the minimum of the function f
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-1, true, 'Test function Rosenbrock, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-1, true, 'Test function Rosenbrock, optimal function value');
	}
	
	// Test function Schwefel
	{
		// Define n
		var n = 25;
		
		// Define the function
		var f = function(x) {
			// Dimension of the problem
			var n = x.length;
			
			var sum = 0;
			for (var i = 0; i < n; ++i) {
				sum -= x[i] * Math.sin(Math.sqrt(Math.abs(x[i])));
			}
			
			return sum;
		}
		
		// The minimum of the function f is attained at (420.9687,...,420.9687) and is equal to -418.9829 * n
		var expectedSol = new Array(n);
		for (var i = 0; i < n; ++i) {
			expectedSol[i] = 420.9687;
		}
		var expectedSolValue = -418.9829 * n;
		
		// Define the initial point: (420,...,420)
		var x0 = new Array(n);
		for (var i = 0; i < n; ++i) {
			x0[i] = 410;
		}
		
		// Define the lower and upper bounds: [-500, 500]^n
		var lowerBounds = new Array(n);
		var upperBounds = new Array(n);
		for (var i = 0; i < n; ++i) {
			lowerBounds[i] = -500;
			upperBounds[i] = 500;
		}
		
		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { alpha: 0.1, 
		                                                                                               lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-2, true, 'Test function Schwefel, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-2, true, 'Test function Schwefel, optimal function value');
	}

	// Test function Trefethen
	{
		// Define the function
		var f = function(x) {
			return Math.exp(Math.sin(50*x[0])) + Math.sin(60*Math.exp(x[1])) + Math.sin(70 * Math.sin(x[0])) + Math.sin(Math.sin(80 * x[1])) - Math.sin(10*(x[0] + x[1])) + 1/4 * (x[0]*x[0] + x[1] * x[1]);
		}
		
		// The minimum of the function f is attained at (-0.0244,0.2106) and is equal to -3.3069
		var expectedSol = [-0.0244,0.2106];
		var expectedSolValue = -3.3069;
		
		// Define the initial point: (-0.02, 0.20)
		var x0 = [-0.02, 0.20];

		// Define the lower and upper bounds: [-1, 1]^2
		var lowerBounds = [-1, -1];
		var upperBounds = [1, 1];
		
		// Compute the minimum of the function f, with default values
		// As this function is particularly difficult to optimize, restart the algorithm several times
		var sol = PortfolioAllocation.thresholdAcceptingSolve_(f, x0, {neighbourGeneratorParameters: { lowerBounds: lowerBounds, 
		                                                                                               upperBounds: upperBounds }});
		assert.equal(Math.abs(f(sol[0]) - expectedSolValue) <= 1e-2, true, 'Test function Trefethen, optimal point');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-2, true, 'Test function Trefethen, optimal function value');
	}
});


QUnit.test('Optimization problems solver - GSS', function(assert) {    	
	// References
	// J.J. More', B.S. Garbow and K.E. Hillstrom, "Testing Unconstrained Optimization Software", ACM Transactions on Mathematical Software, vol. 7(1), pp. 17-41, 1981.
	// Test problems for partially separable optimization and results for the routine PSPMIN, Ph.L. Toint
	// A Literature Survey of Benchmark Functions For Global Optimization Problems, Momin Jamil, Xin-She Yang

	// Test function 1: Rosenbrock function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			return 100*Math.pow((x_2 - x_1*x_1), 2) + Math.pow((1 - x_1), 2);
		}

		// The minimum of the function f is attained at (1,1) and is equal to 0
		var expectedSol = new PortfolioAllocation.Matrix([1, 1]); 
		var expectedSolValue = 0; 
		
		// The initial point is (-1.2, 1)
		var x0 = new PortfolioAllocation.Matrix([-1.2, 1]);

		// Compute the minimum of the function f, with default values, and check the result on the located minimizer
		var sol = PortfolioAllocation.gssSolve_(f, x0);		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Test function Rosenbrock function, default values');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-3, true, 'Test function Rosenbrock function, default values #2');

		// Compute the minimum of the function f, with complete polling, and check the result on the located minimizer
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {pollingType: 'complete'});
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Test function Rosenbrock function, complete polling');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-3, true, 'Test function Rosenbrock function, complete polling #2');
		
		// Compute the minimum of the function f, with custom forcing function, and check the result on the located minimizer
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {rho: function(alpha) { return alpha;} });
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), false, 'Rosenbrock function, custom forcing function');
		assert.equal(Math.abs(sol[1] - expectedSolValue) <= 1e-3, false, 'Rosenbrock function, custom forcing function #2');
	}

	// Test function 2: Freudenstein-Roth function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			return Math.pow(-13 + x_1 + ((5 - x_2)*x_2 - 2)*x_2, 2) + Math.pow(-29 + x_1 + ((x_2 + 1)*x_2 - 14) * x_2, 2);
		}

		// There are two local minimum points of the function f: 
		// - (5,4) with value 0 (global minimum) 
		// - (11.41, -0.8968) with value 48.9842 (local minimum)
		var expectedSol1 = new PortfolioAllocation.Matrix([5, 4]);
		var expectedSol1Value = 0;
		var expectedSol2 = new PortfolioAllocation.Matrix([11.4128, -0.8968]);
		var expectedSol2Value= 48.9842;
		
		// The initial point is (0.5, -2)
		var x0 = new PortfolioAllocation.Matrix([0.5, -2]);

		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0);

		// Check the result on the located minimizer, which must be one of the two local minimum
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol1, 1e-3) ||  
		             PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol2, 1e-3), true, 'Freudenstein-Roth function');
		assert.equal(Math.abs(sol[1] - expectedSol1Value) <= 1e-3 ||  
		             Math.abs(sol[1]-  expectedSol2Value) <= 1e-3, true, 'Freudenstein-Roth function #2');

	}
	
	// Test function 33: Extended Freudenstein-Roth function
	{
		// Define n and m
		var n = 50;
		var m = n-1;
		
		var f = function(x) {
			// Placeholder for sum f_i, i=1..m
			var res = 0;

			// Compute sum f_i, i=1..m
			for (var i = 1; i <= m; ++i) {
				var f_i = Math.pow(x.getValue(i, 1) + x.getValue(i+1, 1)*((5 - x.getValue(i+1, 1)) * x.getValue(i+1, 1) - 2) - 13, 2) +
				          Math.pow(x.getValue(i, 1) + x.getValue(i+1, 1)*((x.getValue(i+1, 1) + 1) * x.getValue(i+1, 1) - 14) - 29, 2);
				res += f_i;
			}

			return res;
		}

		// The gradient of f at (x1,...,xn)
		var gradf = function(x) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
												   function(i,j) { 
														if (i === 1) {
															var x_i = x.getValue(i, 1);
															var x_ip = x.getValue(i+1, 1);
															
															return 2*(x_i + x_ip*((5 - x_ip) * x_ip - 2) - 13) + 2*(x_i + x_ip*((x_ip + 1) * x_ip - 14) - 29);
														}
														else if (i >= 2 && i <= n-1) {
															var x_i = x.getValue(i, 1);
															var x_im = x.getValue(i-1, 1);
															var x_ip = x.getValue(i+1, 1);
															
															return 2*(x_i + x_ip*((5 - x_ip) * x_ip - 2) - 13) + 2*(x_i + x_ip*((x_ip + 1) * x_ip - 14) - 29)
															     + 2*(x_im + 5*Math.pow(x_i, 2) - Math.pow(x_i, 3) - 2*x_i - 13)*(10*x_i - 3*Math.pow(x_i, 2) - 2)
															     + 2*(x_im + + Math.pow(x_i, 3) + Math.pow(x_i, 2) - 14*x_i - 29)*(3*Math.pow(x_i, 2) + 2*x_i -14);
														}
														else if (i === n) {
															var x_i = x.getValue(i, 1);
															var x_im = x.getValue(i-1, 1);
															
															return 2*(x_im + 5*Math.pow(x_i, 2) - Math.pow(x_i, 3) - 2*x_i - 13)*(10*x_i - 3*Math.pow(x_i, 2) - 2)
															     + 2*(x_im + + Math.pow(x_i, 3) + Math.pow(x_i, 2) - 14*x_i - 29)*(3*Math.pow(x_i, 2) + 2*x_i -14);
														}
													}); 
		}
		
		// The initial point is (-2...-2)
		var x0 = PortfolioAllocation.Matrix.ax(-2, PortfolioAllocation.Matrix.ones(n, 1));

		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {eps: 1e-8});

		// Check the result on the located minimizer, using the nullity of the gradient as a necessary and sufficient condition
		assert.equal(Math.abs(gradf(sol[0]).vectorNorm('infinity')) <= 1e-3, true, 'Test function 31 extended Freudenstein-Roth function');
	}
	
	// Test function 6: Jennrich-Sampson function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			// Placeholder for sum f_i^2, i=1..10
			var res = 0;

			// Compute sum f_i^2, i=1..10
			for (var i = 1; i <= 10; ++i) {
				var f_i = 2 + 2*i - (Math.exp(i*x_1) + Math.exp(i*x_2));
				res += f_i * f_i;
			}

			return res;
		}

		// The global minimum is located at (0.25782521321500883,0.25782521381356827),
		// with value 124.36218235561473896
		var expectedSol = new PortfolioAllocation.Matrix([0.25782521321500883, 0.25782521381356827]);
		
		// The initial point is (0.3, 0.4)
		var x0 = new PortfolioAllocation.Matrix([0.3, 0.4]);

		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0);

		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-4), true, 'Jennrich-Sampson function');
	}
	
	// Test function 8: Bard function
	{
		// Define n and m
		var n = 3;
		var m = 15;
		
		// Define the coefficients y
		var y = [0.14, 0.18, 0.22, 0.25, 0.29, 0.32, 0.35, 0.39, 0.37, 0.58, 0.73, 0.96, 1.34, 2.10, 4.39];
		
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			var x_3 = x.getValue(3, 1);
			
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;

			// Compute sum f_i^2, i=1..m
			for (var i = 1; i <= m; ++i) {
				var u_i = i;
				var v_i = 16 - i;
				var w_i = Math.min(u_i, v_i);
				var f_i = y[i-1] - (x_1 + u_i/(v_i*x_2 + w_i*x_3));
				res += f_i * f_i;
			}

			return res;
		}

		// The minimum reported is of ~8.21487...10^-3, at point below
		var expectedSol = new PortfolioAllocation.Matrix([0.08241040, 1.133033, 2.343697]);
		
		// The initial point is (1, 1, 1)
		var x0 = new PortfolioAllocation.Matrix([1, 1, 1]);

		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0);

		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Bard function');
	}

	// Test function 10: Meyer function
	// This one is very hard unfortunately
	{
		// Define n and m
		var n = 3;
		var m = 16;
		
		// Define the coefficients y
		var y = [34780, 28610, 23650, 19630, 16370, 13720, 11540, 9744, 8261, 7030, 6005, 5147, 4427, 3820, 3307, 2872];
		
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			var x_3 = x.getValue(3, 1);
			
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;

			// Compute sum f_i^2, i=1..m
			for (var i = 1; i <= m; ++i) {
				var t_i = 45 + 5*i;
				var f_i = x_1 * Math.exp(x_2 / (t_i + x_3)) - y[i-1];
				res += f_i * f_i;
			}

			return res;
		}

		// The minimum reported value is ~87.945855171
		// The associated optimal values of the parameters are as below.
		// Reference: https://www.itl.nist.gov/div898/strd/nls/data/LINKS/v-mgh10.shtml
		var expectedSol = new PortfolioAllocation.Matrix([5.6096364710E-03, 6.1813463463E+03, 3.4522363462E+02]);
		
		// Three different starting values:
		// - (2, 400000, 25000)
		// - (0.02, 4000, 250)
		// - (5.6096364710E-03, 6.1813463463E+03, 3.4522363462E+02)
		//var x0 = new PortfolioAllocation.Matrix([2, 400000, 25000]);
		//var x0 = new PortfolioAllocation.Matrix([0.02, 4000, 250]);
		var x0 = new PortfolioAllocation.Matrix([5.6096364710E-03, 6.1813463463E+03, 3.4522363462E+02]);

		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0);

		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Meyer function');
	}
	
	// Test function 11: Gulf research problem function
	{
		// Define n and m
		var n = 3;
		var m = 99;
		
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			var x_3 = x.getValue(3, 1);
			
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;

			// Compute sum f_i^2, i=1..m
			for (var i = 1; i <= m; ++i) {
				var t_i = i/100;
				var y_i = 25 + Math.pow(-50*Math.log(t_i), 2/3)
				var f_i = Math.exp(- Math.pow(y_i - x_2, x_3) / x_1) - t_i;
				res += f_i * f_i;
			}

			return res;
		}

		// The minimum value is 0 at (50, 25, 1.5)
		var expectedSol = new PortfolioAllocation.Matrix([50, 25, 1.5]);
		
		// The initial point is (5, 2.5, 0.15)
		var x0 = new PortfolioAllocation.Matrix([5, 2.5, 0.15]);

		// Compute the minimum of the function f, with standard lower bounds constraints
		// but upper bounds constraints equal to the expected solution instead of the standard
		// upper bounds constraints [100, 25.6, 5].
		//
		// Otherwise, the convergence is too slow.
		var sol = PortfolioAllocation.gssSolve_(f, x0, [0.1, 0, 0], [50, 25, 1.5], { eps: 1e-7, maxIter: 800000});

		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Gulf research problem function');
	}
	
	// Test function 30: broydn3d
	{
		// Define n and m
		var n = 50;
		var m = n;
		
		var f = function(x) {
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;
		
			// Compute f_1^2
			var f_1 = (3 - 2*x.getValue(1, 1))*x.getValue(1, 1) - 2*x.getValue(2, 1) + 1;
			res += f_1 * f_1;
			
			// Compute sum f_i^2, i=2..n-1
			for (var i = 2; i <= n-1; ++i) {
				var f_i = (3 - 2*x.getValue(i, 1))*x.getValue(i, 1) - x.getValue(i-1, 1) - 2*x.getValue(i+1, 1) + 1;
				res += f_i * f_i;
			}
			
			// Compute f_n^2
			var f_n = (3 - 2*x.getValue(n, 1))*x.getValue(n, 1) - x.getValue(n-1, 1) + 1;
			res += f_n * f_n;
			
			return res;
		}
		
		// There are several global minimums of the function f, in which f value is 0
		var expectedFunctionValue = 0;
		
		// The initial point is (-1,...,-1)
		var x0 = PortfolioAllocation.Matrix.ax(-1, PortfolioAllocation.Matrix.ones(n, 1));

		// Compute the minimum of the function f, with probabilistic descent directions
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, { unconstrainedPollingSet: 'probabilisticDescentDirections'});
		
		// Check the result on f value
		assert.equal(Math.abs(sol[1] - expectedFunctionValue) <= 1e-3, true, 'Test function 30 broydn3d');
	}
	
	// Test function 32: arglina
	{
		// Define n and m
		var n = 100;
		var m = n;
		
		var f = function(x) {
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;
			
			// Pre-compute sum x_j, j=1..n
			var sum_x_j = 0;
			for (var j = 1; j <= n; ++j) {
				sum_x_j += x.getValue(j, 1);
			}
			
			// Compute sum f_i^2, i=1..n
			for (var i = 1; i <= n; ++i) {
				var f_i = x.getValue(i, 1) - 2/m * sum_x_j - 1;
				res += f_i * f_i;
			}
			
			// Compute sum f_i^2, i=n+1..m
			for (var i = n+1; i <= m; ++i) {
				var f_i = - 2/m * sum_x_j - 1;
				res += f_i * f_i;
			}
						
			return res;
		}

		// There is one global minimum of the function f: (-1,...,-1), in which f value is m - n
		var expectedSol = PortfolioAllocation.Matrix.ax(-1, PortfolioAllocation.Matrix.ones(n, 1));
		
		// The initial point is (1,...,1)
		var x0 = PortfolioAllocation.Matrix.ones(n, 1);

		// Compute the minimum of the function f, with probabilistic descent directions
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {unconstrainedPollingSet: 'probabilisticDescentDirections'});
		
		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Test function 32 arglina');
	}
	
	// Test function 33: arglinb	
	{
		// Define n and m
		var n = 50;
		var m = n;
		
		var f = function(x) {
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;
			
			// Pre-compute sum j*x_j, j=1..n
			var sum_j_x_j = 0;
			for (var j = 1; j <= n; ++j) {
				sum_j_x_j += j * x.getValue(j, 1);
			}
			
			// Compute sum f_i^2, i=1..m
			for (var i = 1; i <= m; ++i) {
				var f_i = i * sum_j_x_j - 1;
				res += f_i * f_i;
			}
						
			return res;
		}

		// There are several global minimums of the function f, at which f value is m(m-1)/(2*(2m+1));
		// These points x_j, j=1..n are such that sum j*x_j, j=1..n = 3/(2m+1)
		var expectedFunctionValue = m * (m - 1) / ( 2 * (2*m + 1) );
		
		// The initial point is (1,...,1)
		var x0 = PortfolioAllocation.Matrix.ones(n, 1);

		// Compute the minimum of the function f, with probabilistic descent directions
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {unconstrainedPollingSet: 'probabilisticDescentDirections'});
		
		// Check the result on f value
		assert.equal(Math.abs(sol[1] - expectedFunctionValue) <= 1e-3, true, 'Test function 33 arglinb, #1');
		
		// Check the result on the located minimizer
		var sum_j_sol_j = 0;
		for (var j = 1; j <= n; ++j) {
			sum_j_sol_j += j * sol[0].getValue(j, 1);
		}
		assert.equal(Math.abs(sum_j_sol_j - 3 / (2*m +1 )) <= 1e-3, true, 'Test function 33 arglinb, #2');
	}
	
	// Test function dqrtic
	// Reference:  A.R. Buckley, "Test functions for unconstrained minimization"
	{
		// Define n and m
		var n = 50;
		var m = n;
		
		var f = function(x) {
			// Placeholder for sum f_i^2, i=1..m
			var res = 0;

			// Compute sum f_i^2, i=1..m
			for (var i = 1; i <= m; ++i) {
				var f_i = Math.pow((x.getValue(i, 1) - i), 2);
				res += f_i * f_i;
			}
						
			return res;
		}
		
		// There is one global minimum of the function f at point (1,2,...,n), where f value is 0
		var expectedSol = PortfolioAllocation.Matrix.fill(n, 1, function(i,j) { return i; });
		
		// The initial point is (2,...,2)
		var x0 = PortfolioAllocation.Matrix.ax(2, PortfolioAllocation.Matrix.ones(n, 1));

		// Compute the minimum of the function f, with default values
		 var sol = PortfolioAllocation.gssSolve_(f, x0);

		// Check the result on the located minimizer
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Test function dqrtic');
	}
	
	// Test function engval1
	// Reference: Test problems for partially separable optimization and results for the routine PSPMIN, Ph.L. Toint, problem 31
	{
		// Define n and m
		var n = 50;
		var m = n-1;
		
		var f = function(x) {
			// Placeholder for sum f_i, i=1..m
			var res = 0;

			// Compute sum f_i, i=1..m
			for (var i = 1; i <= m; ++i) {
				var f_i = Math.pow(x.getValue(i, 1)*x.getValue(i, 1) + x.getValue(i+1, 1)*x.getValue(i+1, 1), 2) - 4*x.getValue(i, 1) + 3
				res += f_i;
			}
						
			return res;
		}
		
		// The gradient of f at (x1,...,xn) is (4x1(x1^2 + x2^2) - 4,...,4xi(xi^2 + xi+1^2) - 4 + 4xi(xi-1^2 + xi^2),...,4xn(xn-1^2 + xn^2))
		var gradf = function(x) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
												   function(i,j) { 
														if (i === 1) {
															return 4*x.getValue(i, 1)*(x.getValue(i, 1)*x.getValue(i, 1) + x.getValue(i+1, 1)*x.getValue(i+1, 1)) - 4;
														}
														else if (i >= 2 && i <= n-1) {
															return 4*x.getValue(i, 1)*(x.getValue(i, 1)*x.getValue(i, 1) + x.getValue(i+1, 1)*x.getValue(i+1, 1)) - 4 
															     + 4*x.getValue(i, 1)*(x.getValue(i-1, 1)*x.getValue(i-1, 1) + x.getValue(i, 1)*x.getValue(i, 1));
														}
														else if (i === n) {
															return 4*x.getValue(i, 1)*(x.getValue(i-1, 1)*x.getValue(i-1, 1) + x.getValue(i, 1)*x.getValue(i, 1));
														}
													}); 
		}
		
		// The initial point is (2,...,2)
		var x0 = PortfolioAllocation.Matrix.ax(2, PortfolioAllocation.Matrix.ones(n, 1));
		
		// Compute the minimum of the function f, with default values
		var sol = PortfolioAllocation.gssSolve_(f, x0, null, null, {eps: 1e-8});

		// Check the result on the located minimizer, using the nullity of the gradient as a necessary and sufficient condition
		assert.equal(Math.abs(gradf(sol[0]).vectorNorm('infinity')) <= 1e-4, true, 'Test function engval1');
	}

	// Test function: Adjiman function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			return Math.cos(x_1)*Math.sin(x_2) - x_1/(x_2*x_2 + 1);
		}

		// Three local minimas have been identified in the original Adjiman paper:
		// f = -2.02181 at (2,0.10578) <-- global optima
		// f = -0.99495 at (0.63627, -1)
		// f = 0.95465 at (-1, 1)
		var expectedSol = new PortfolioAllocation.Matrix([2, 0.10578]); 
		
		// The initial point is (0, 0)
		var x0 = new PortfolioAllocation.Matrix([0, 0]);
		
		// Compute the minimum of the function f, with upper and lower bounds
		var sol = PortfolioAllocation.gssSolve_(f, x0, [-1, -1], [2, 1]);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Adjiman function');
	}
	
	// Test function: Bartels Conn function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			return Math.abs(x_1*x_1 + x_2*x_2 +x_1*x_2) + Math.abs(Math.sin(x_1)) + Math.abs(Math.cos(x_2));
		}

		// The global minimum is located at (0,0) with f = 0
		var expectedSol = new PortfolioAllocation.Matrix([0, 0]); 
		
		// The initial point taken is (-250, 250)
		var x0 = new PortfolioAllocation.Matrix([-250, 250]);
		
		// Compute the minimum of the function f, with upper and lower bounds
		var sol = PortfolioAllocation.gssSolve_(f, x0, [-500, -500], [500, 500]);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Bartels Conn function');
	}
	
	// Test function: Beale function
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			var x_2 = x.getValue(2, 1);
			
			return Math.pow(1.5 - x_1 + x_1*x_2, 2) + Math.pow(2.25 - x_1 + x_1*x_2*x_2, 2) + Math.pow(2.625 - x_1 + x_1*x_2*x_2*x_2, 2);
		}

		// The global minimum is located at (3,0.5) with f = 0
		var expectedSol = new PortfolioAllocation.Matrix([3, 0.5]); 
		
		// The initial point taken is (3, 0)
		var x0 = new PortfolioAllocation.Matrix([3, 0]);
		
		// Compute the minimum of the function f, with upper and lower bounds
		var sol = PortfolioAllocation.gssSolve_(f, x0, [-4.5, -4.5], [4.5, 4.5]);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-3), true, 'Beale function');
	}
});


QUnit.test('Composite convex programming solver - FISTA', function(assert) {    
	// Functions used to generate random optimization problems
	function generateRandomDimension(min, max) {
		return Math.floor(Math.random()*(max-min+1) + min);
	}
	
	function generateRandomValue(minVal, maxVal) {
		return Math.random() * (maxVal - minVal) + minVal;
	}
	
	// Test with a 1D function from Scipy documentation
	// Reference: https://www.scipy-lectures.org/advanced/mathematical_optimization/#id36
	{
		var f = function(x) {
			var x_1 = x.getValue(1, 1);
			return Math.exp((x_1 - 0.7)*(x_1 - 0.7));
		}
		
		var gradf = function(x) {
			var x_1 = x.getValue(1, 1);
			var df_x_1 = 2 * Math.exp((x_1 - 0.7)*(x_1 - 0.7)) * (x_1 - 0.7);
			return new PortfolioAllocation.Matrix([df_x_1]); 
		}
		
		// The minimum of the function f is attained at x = 0.7
		var expectedSol = new PortfolioAllocation.Matrix([0.7]); 
		
		// Let's minimize f over the convex set H = [0, 1]
		var g = function(x) {
			var x_1 = x.getValue(1, 1);
			if (0 > x_1 || x_1 > 1) {
				return Number.POSITIVE_INFINITY;
			}
			return 0;
		}
		
		// The proximal function associated to g is the orthogonal
		// projection on H.
		var proxg = function(x, mu) {
			var x_1 = x.getValue(1, 1);
			return new PortfolioAllocation.Matrix([Math.max(0, Math.min(x_1, 1))]);
		}
		
		// The initial point is arbitrary, let's take a random value belonging to [-2, 2]
		var x0 = new PortfolioAllocation.Matrix([generateRandomValue(-2, 2)]);

		// Compute the minimum of the function f on the convex set H, with default values
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-04), true, 'Scipy 1D example function');
		
		
		// Generate another initial point, deterministic (0),
		// in order to check the convergence properties of the FISTA
		// algorithm.
		var x0 = PortfolioAllocation.Matrix.zeros(1,1);

		// Compute the minimum of the function f on the convex set H, with default values
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-10), false, 'Scipy 1D example function, higher precision KO');

		// Compute the minimum of the function f on the convex set H, with a higher precision
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0, {eps: 1e-10});
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-10), true, 'Scipy 1D example function, higher precision OK');
	}

	// Test with the first function of De Jong, using random data
	// Reference: Molga M., Smutnicki C. (2005) Test functions for optimization needs.
	{
		var n = generateRandomDimension(1, 100);

		// The first function of De Jong’s is f(x1,...,xn) = sum x_i^2, i=1..n
		var f = function(x) {
			var sum_x_i_square = 0;
			for (var i = 1; i <= n; ++i) {
				var x_i = x.getValue(i, 1);
				
				sum_x_i_square += x_i * x_i;
			}
			return sum_x_i_square;
		}
		// The gradient of f at (x1,...,xn) is (2x1,...,2xn)
		var gradf = function(x) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
			                                       function(i,j) { 
														return 2*x.getValue(i, 1);
													}); 
		}

		// The unique global minimum of f is located at point x^* = (0,...,0)
		var expectedSol = PortfolioAllocation.Matrix.zeros(n, 1);
		
		// The first function of De Jong is usually optimized on the 
		// hyperrectangle H = {x, -5.12 <= x_i <= 5.12, i=1..n}, so that g is the 
		// indicator function of H: 
		// - g(x) = 0 <=> x in H
		// - g(x) = +oo <=> x not in H
		var g = function(x) {
			for (var i = 1; i <= n; ++i) {
				var x_i = x.getValue(i, 1);
				
				if (-5.12 > x_i || x_i > 5.12) {
					return Number.POSITIVE_INFINITY;
				}
			}
			return 0;
		}
		
		// The proximal function associated to g is the orthogonal
		// projection on H.
		var proxg = function(x, mu) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
			                                       function(i,j) { 
														return Math.max(-5.12, Math.min(x.getValue(i, 1), 5.12));
													});
		}
		
		// The initial point is arbitrary, let's take 2 * H
		var x0 = PortfolioAllocation.Matrix.fill(n, 1, 
											   function(i,j) { 
													return generateRandomValue(2 * -5.12, 5.12 * 2);
												});
		
		// Compute the minimum of the function f on the convex set H
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-04), true, 'First function of De Jong, n = ' + n);
	}
	
	// Test with the weighted sphere model function, using random data
	// Reference: Molga M., Smutnicki C. (2005) Test functions for optimization needs.
	{
		var n = generateRandomDimension(1, 100);

		// The weighted sphere model function is f(x1,...,xn) = sum i*x_i^2, i=1..n
		var f = function(x) {
			var sum_i_x_i_square = 0;
			for (var i = 1; i <= n; ++i) {
				var x_i = x.getValue(i, 1);
				
				sum_i_x_i_square += i * x_i * x_i;
			}
			return sum_i_x_i_square;
		}
		// The gradient of f at (x1,...,xn) is (2x1,4x2,6x3...,2nxn)
		var gradf = function(x) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
			                                       function(i,j) { 
														return 2*i*x.getValue(i, 1);
													}); 
		}

		// The unique global minimum of f is located at point x^* = (0,...,0)
		var expectedSol = PortfolioAllocation.Matrix.zeros(n, 1);
		
		// The  weighted sphere model function is usually optimized on the 
		// hyperrectangle H = {x, -5.12 <= x_i <= 5.12, i=1..n}, so that g is the 
		// indicator function of H: 
		// - g(x) = 0 <=> x in H
		// - g(x) = +oo <=> x not in H
		var g = function(x) {
			for (var i = 1; i <= n; ++i) {
				var x_i = x.getValue(i, 1);
				
				if (-5.12 > x_i || x_i > 5.12) {
					return Number.POSITIVE_INFINITY;
				}
			}
			return 0;
		}
		
		// The proximal function associated to g is the orthogonal
		// projection on H.
		var proxg = function(x, mu) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
			                                       function(i,j) { 
														return Math.max(-5.12, Math.min(x.getValue(i, 1), 5.12));
													});
		}
		
		// The initial point is arbitrary, let's take 2 * H
		var x0 = PortfolioAllocation.Matrix.fill(n, 1, 
											   function(i,j) { 
													return generateRandomValue(2 * -5.12, 5.12 * 2);
												});
		
		// Compute the minimum of the function f on the convex set H
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-04), true, 'Weighted sphere model function, n = ' + n);
	}
	
	// Test with the the ARWHEAD function
	// Reference: Problem 55 in A.R. Conn, N.I.M. Gould, M. Lescrenier and Ph.L. Toint, Performance of a multifrontal scheme for partially separable optimization.
	{
		var n = generateRandomDimension(5000, 5000);

		// The arrow head function is f(x1,...,xn) = sum((x_i^2 + x_n^2)^2 - 4*x_i + 3), i=1..n-1
		var f = function(x) {		
			var x_n = x.getValue(n, 1);

			var sum_f_i = 0;
			for (var i = 1; i <= n-1; ++i) {
				var x_i = x.getValue(i, 1);
				
				sum_f_i += (x_i*x_i + x_n*x_n)*(x_i*x_i + x_n*x_n) - 4*x_i + 3;
			}
			return sum_f_i;
		}
		// The gradient of f at (x1,...,xn) is (4*(x_1^2 + x_n^2)*x_1 - 4,...,sum (4*(x_i^2 + x_n^2)*x_n), i=1..n-1)
		var gradf = function(x) {
			return PortfolioAllocation.Matrix.fill(n, 1, 
			                                       function(i,j) { 
														var x_n = x.getValue(n, 1);
														
														if (i <= n-1) {
															var x_i = x.getValue(i, 1);
															
															return 4*(x_i*x_i + x_n*x_n)*x_i - 4;
														}
														else if (i == n) {
															var sum_gradf_i = 0;
															for (var i = 1; i <= n-1; ++i) {
																var x_i = x.getValue(i, 1);
																
																sum_gradf_i += 4*(x_i*x_i + x_n*x_n)*x_n;
															}
															return sum_gradf_i;
														}
													}); 
		}

		// The unique global minimum of f is located at point x^* = (1,1,...,0)
		var expectedSol = PortfolioAllocation.Matrix.ones(n, 1);
		expectedSol.setValue(n, 1, 
		                     0);
		
		// The arrow head function is optimized on R^n so that g is the 
		// projection on R^n.
		var g = function(x) {
			return 0;
		}
		
		// The proximal function associated to g is the orthogonal
		// projection on R^n, i.e., the identity.
		var proxg = function(x, mu) {
			return x;
		}
		
		// The initial point is usually taken to be a vector of ones.
		var x0 = PortfolioAllocation.Matrix.ones(n, 1);
		
		// Compute the minimum of the function f on R^n
		var sol = PortfolioAllocation.ccpsolveFISTA_(f, gradf, g, proxg, x0);
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedSol, 1e-04), true, 'ARWHEAD function, n = ' + n);
	}
	
});

	
QUnit.test('Quadratic programming solver (single linear constraint and finite bound constraints) - Sequential Minimization Optimization algorithm', function(assert) {    
	// Functions to generate random feasible instances of the quadratic problem
	function generateRandomDimension(min, max) { // used for n
		return Math.floor(Math.random()*(max-min+1) + min);
	}
	
	function generateRandomValue(minVal, maxVal) { // used for r		
		return Math.random() * (maxVal - minVal) + minVal;
	}
	
	function generateRandomBounds(n, b) { // used for l and u and r
		var minVal = -10;
		var maxVal = 10;
		
		var l = PortfolioAllocation.Matrix.zeros(n, 1);
		var u = PortfolioAllocation.Matrix.zeros(n, 1);
		
		var sum_b_lb = 0;
		for (var i = 0; i < n; ++i) {
			var lb = generateRandomValue(minVal, maxVal);
			l.data[i] = lb;
			sum_b_lb += b.data[i] * lb;
		}
		var r = sum_b_lb + (1 - generateRandomValue(0, 1)); // feasibility criterion: sum b_i * l_i <= r (because b_i > 0)
		
		do {
			var sum_b_ub = 0;
			for (var i = 0; i < n; ++i) {
				var ub = generateRandomValue(l.data[i], 2*maxVal); // ensure l <= u
				u.data[i] = ub;
				sum_b_ub += b.data[i] * ub;
			}
		} while (sum_b_ub < r) // feasibility criterion: sum b_i * u_i >= r (because b_i > 0)

		return [l, u, r];
	}
	
	function generateRandomStriclyPositiveVector(n) { // used for b
		var minVal = 0;
		var maxVal = 10;
		
		var v = PortfolioAllocation.Matrix.zeros(n, 1);
		
		for (var i = 0; i < n; ++i) {
			v.data[i] = maxVal - generateRandomValue(minVal, maxVal); // ]minVal, maxVal]
		}
		
		return v;
	}

	function generateRandomSemiDefinitePositiveMatrix(n) { // used for Q
		var minVal = 0;
		var maxVal = 10;
		
		// Generate a random orthogonal matrix Q
		var A = PortfolioAllocation.Matrix.fill(n, n, 
												function(i,j) { 
													return generateRandomValue(minVal, maxVal);
												});
		var qr = PortfolioAllocation.Matrix.qrDecomposition(A);
		var Q = qr[0];
		
		// Generate a random diagonal matrix with strictly positive elements
		var D = PortfolioAllocation.Matrix.zeros(n, 1);
		for (var i = 0; i < n; ++i) {
			D.data[i] = maxVal - generateRandomValue(minVal, maxVal); // ]minVal, maxVal]
		}
		
		// Replace a random number of them (potentially 0, at maximum n-1) by null elements
		if (n >= 2) {
			var nbNullElements = generateRandomDimension(0, n-1);
			for (var i = 0; i < nbNullElements; ++i) { // the position of the elements replaced is not random
				D.data[i] = 0;
			}
		}
		
		// Generate a random (symetric) positive definite positive matrix using the formula
		// Q^t*D*Q
		return PortfolioAllocation.Matrix.txy(Q, PortfolioAllocation.Matrix.elementwiseProduct(Q, D));
	}
	
	function generateRandomVector(n) { // used for p
		var minVal = -10;
		var maxVal = 10;
		
		var v = PortfolioAllocation.Matrix.zeros(n, 1);
		
		for (var i = 0; i < n; ++i) {
			v.data[i] = generateRandomValue(minVal, maxVal);
		}
		
		return v;
	}
	
	// Test non-supported problems: 
	// - b_i <= 0
	// - TODO: Non SDP Q matrix
	{
		var n = generateRandomDimension(1, 50);
		var Q = generateRandomSemiDefinitePositiveMatrix(n);
		var p = generateRandomVector(n);
		var b = generateRandomStriclyPositiveVector(n);
		var bounds = generateRandomBounds(n, b);
		var l = bounds[0];
		var u = bounds[1];
		var r = bounds[2];
		
		var m = generateRandomDimension(1, n); // coordinate of b/d to alter
		var b_old = b.data[m-1];
		
		// Test b_i = 0
		b.data[m-1] = 0;
		assert.throws(function() { PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u) },
							       new Error('negative element detected in b'),
								  "Unsupported problem - Null b element");

		// Test b_i < 0
		b.data[m-1] = Math.random() - 1;
		assert.throws(function() { PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u) },
							       new Error('negative element detected in b'),
								  "Unsupported problem - Strictly negative b element");		
	}
	
	// Test infeasible problems:
	// - u_i < l_i
	// - sum b_i * l_i > r
	// - sum b_i * u_i < r
	{
		var n = generateRandomDimension(1, 50);
		var Q = generateRandomSemiDefinitePositiveMatrix(n);
		var p = generateRandomVector(n);
		var b = generateRandomStriclyPositiveVector(n);
		var bounds = generateRandomBounds(n, b);
		var l = bounds[0];
		var u = bounds[1];
		var r = bounds[2];
		
		var m = generateRandomDimension(1, n); // coordinate of l/u to alter
		var l_old = l.data[m-1];
		var u_old = u.data[m-1];
		
		// Test u_i < l_i
		l.data[m-1] = u_old;
		u.data[m-1] = l_old;
		assert.throws(function() { PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Lower bounds strictly greater than upper bounds");
								  
		// Restore l and u
		l.data[m-1] = l_old;
		u.data[m-1] = u_old;
		
		// Test infeasible lower bounds condition - sum b_i * l_i > r
		l.data[m-1] = (-(PortfolioAllocation.Matrix.vectorDotProduct(b, l) - b.data[m-1]*l.data[m-1]) + r + (1 - Math.random()))/b.data[m-1];
		assert.throws(function() { PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Lower bounds incompatible with b and r");
		
		// Restore l
		l.data[m-1] = l_old;	
		
		// Test infeasible upper bounds condition - sum b_i * u_i < r
		u.data[m-1] = (-(PortfolioAllocation.Matrix.vectorDotProduct(b, u) - b.data[m-1]*u.data[m-1]) + r - (1 - Math.random()))/b.data[m-1];
		assert.throws(function() { PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Upper bounds incompatible with b and r");
	}

	// Test feasible random problems with positive definite matrices and semi positive definite matrices 
	// Reference: Convergence of a Generalized SMO Algorithm for SVM Classifier Design
	{
		var nbTests = 100;
		for (var k = 0; k < nbTests; ++k) {
			var n = generateRandomDimension(1, 50);
			var Q = generateRandomSemiDefinitePositiveMatrix(n);
			var p = generateRandomVector(n);
			var b = generateRandomStriclyPositiveVector(n);
			var bounds = generateRandomBounds(n, b);
			var l = bounds[0];
			var u = bounds[1];
			var r = bounds[2];
			
			var sol = PortfolioAllocation.qpsolveGSMO_(Q, p, b, r, l, u);
			var x = sol[0];
			var f_x = sol[1];
			
			// Check that f_x corresponds to the value of the function f at point x
			var expected_f_x = 1/2 * PortfolioAllocation.Matrix.vectorDotProduct(x, PortfolioAllocation.Matrix.xy(Q, x)) 
							   + PortfolioAllocation.Matrix.vectorDotProduct(p, x);
			assert.equal(Math.abs(f_x - expected_f_x) <= Math.abs(expected_f_x) * 1e-16, true, 'Feasible problem ' + (k+1) + ' - 1/2');
			
			// Check the KKT conditions, which are necessary and sufficient since the problem is convex,
			// c.f. formulas 1a, 1b and 1c of the reference:
			// - if x(i) == l(i), F_i >= beta
			// - if l(i) < x(i) < u(i), F_i = beta
			// - if x(i) == u(i), F_i <= beta

			// 1: Compute the vector F
			var F = PortfolioAllocation.Matrix.xpy(PortfolioAllocation.Matrix.xy(Q, x), p);
			for (var i = 0; i < n; ++i) {
				F.data[i] /= b.data[i];
			}
			
			// 2: Try to numerically determine beta by searching for a free variable
			var beta = null;
			for (var i = 0; i < n; ++i) {
				if (l.data[i] < x.data[i] && x.data[i] < u.data[i]) {
					beta = F.data[i];
					break;
				}
			}
			// 2bis: If the above search failed, default to numerically determine beta by selecting
			// beta as max {F_i, i such that x(i) == u(i)}.
			if (beta == null) {
				beta = -Infinity;
				for (var i = 0; i < n; ++i) {
					if (x.data[i] == u.data[i]) {
						beta = Math.max(beta, F.data[i]);
					}
				}
			}
			// 2ter: If the above search failed, default to numerically determine beta by selecting
			// beta as min {F_i, i such that x(i) == l(i)}.
			if (beta == null) {
				beta = Infinity;
				for (var i = 0; i < n; ++i) {
					if (x.data[i] == l.data[i]) {
						beta = Math.min(beta, F.data[i]);
					}
				}
			}

			// Check the KKT conditions on the vector F
			var eps_beta = 1e-4;
			var kkt_conditions_ok = true;
			for (var i = 0; i < n; ++i) {
				if (x.data[i] == l.data[i]) {
					if (F.data[i] < beta) {
						kkt_conditions_ok = false;
						break;
					}
				}
				else if (x.data[i] == u.data[i]) {
					if (F.data[i] > beta) {
						kkt_conditions_ok = false;
						break;
					}
				}
				else if (l.data[i] < x.data[i] && x.data[i] < u.data[i]) {
					// Specific comparison is needed here due to numerical precision on beta
					if (Math.abs(F.data[i] - beta) > eps_beta) {
						kkt_conditions_ok = false;
						break;
					}
				}
			}
			assert.equal(kkt_conditions_ok, true, 'Feasible problem ' + (k+1) + ' - 2/2');
		}
	}	
});


QUnit.test('Continuous quadratic knapsack problem solver - Breakpoint searching algorithm', function(assert) {    
	// Functions to generate random feasible instances of the continuous quadratic knapsack problem
	function generateRandomDimension(min, max) { // used for n
		return Math.floor(Math.random()*(max-min+1) + min);
	}
	
	function generateRandomValue(minVal, maxVal) { // used for r		
		return Math.random() * (maxVal - minVal) + minVal;
	}
	
	function generateRandomBounds(n, b) { // used for l and u and r
		var minVal = -10;
		var maxVal = 10;
		
		var l = PortfolioAllocation.Matrix.zeros(n, 1);
		var u = PortfolioAllocation.Matrix.zeros(n, 1);
		
		var sum_b_lb = 0;
		for (var i = 0; i < n; ++i) {
			var lb = generateRandomValue(minVal, maxVal);
			l.data[i] = lb;
			sum_b_lb += b.data[i] * lb;
		}
		var r = sum_b_lb + (1 - generateRandomValue(0, 1)); // feasibility criterion: sum b_i * l_i <= r (because b_i > 0)
		 
		do {
			var sum_b_ub = 0;
			for (var i = 0; i < n; ++i) {
				var ub = generateRandomValue(l.data[i], 2*maxVal); // ensure l <= u
				u.data[i] = ub;
				sum_b_ub += b.data[i] * ub;
			}
		} while (sum_b_ub < r) // feasibility criterion: sum b_i * u_i >= r (because b_i > 0)

		return [l, u, r];
	}
	
	function generateRandomStriclyPositiveVector(n) { // used for d and b
		var minVal = 0;
		var maxVal = 10;
		
		var v = PortfolioAllocation.Matrix.zeros(n, 1);
		
		for (var i = 0; i < n; ++i) {
			v.data[i] = maxVal - generateRandomValue(minVal, maxVal); // ]minVal, maxVal]
		}
		
		return v;
	}
	
	function generateRandomVector(n) { // used for a
		var minVal = -10;
		var maxVal = 10;
		
		var v = PortfolioAllocation.Matrix.zeros(n, 1);
		
		for (var i = 0; i < n; ++i) {
			v.data[i] = generateRandomValue(minVal, maxVal);
		}
		
		return v;
	}
	
	// Test non-supported problems: 
	// - b_i <= 0
	// - d_i <= 0
	{
		var n = generateRandomDimension(1, 50);
		var d = generateRandomStriclyPositiveVector(n);
		var a = generateRandomVector(n);
		var b = generateRandomStriclyPositiveVector(n);
		var bounds = generateRandomBounds(n, b);
		var l = bounds[0];
		var u = bounds[1];
		var r = bounds[2];
		
		var m = generateRandomDimension(1, n); // coordinate of b/d to alter
		var b_old = b.data[m-1];
		var d_old = d.data[m-1];
		
		// Test b_i = 0
		b.data[m-1] = 0;
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('negative element detected in b'),
								  "Unsupported problem - Null b element");

		// Test b_i < 0
		b.data[m-1] = Math.random() - 1;
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('negative element detected in b'),
								  "Unsupported problem - Strictly negative b element");
		
		// Restore b
		b.data[m-1] = b_old;
		
		// Test d_i = 0
		d.data[m-1] = 0;
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('negative element detected in d'),
								  "Unsupported problem - Null d element");
				
		// Test d_i < 0
		d.data[m-1] = Math.random() - 1;
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('negative element detected in d'),
								  "Unsupported problem - Strictly negative d element");
	}
	
	// Test infeasible problems:
	// - u_i < l_i
	// - sum b_i * l_i > r
	// - sum b_i * u_i < r
	{
		var n = generateRandomDimension(1, 50);
		var d = generateRandomStriclyPositiveVector(n);
		var a = generateRandomVector(n);
		var b = generateRandomStriclyPositiveVector(n);
		var bounds = generateRandomBounds(n, b);
		var l = bounds[0];
		var u = bounds[1];
		var r = bounds[2];
		
		var m = generateRandomDimension(1, n); // coordinate of l/u to alter
		var l_old = l.data[m-1];
		var u_old = u.data[m-1];
		
		// Test u_i < l_i
		l.data[m-1] = u_old;
		u.data[m-1] = l_old;
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Lower bounds strictly greater than upper bounds");
								  
		// Restore l and u
		l.data[m-1] = l_old;
		u.data[m-1] = u_old;
		
		// Test infeasible lower bounds condition - sum b_i * l_i > r
		l.data[m-1] = (-(PortfolioAllocation.Matrix.vectorDotProduct(b, l) - b.data[m-1]*l.data[m-1]) + r + (1 - Math.random()))/b.data[m-1];
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Lower bounds incompatible with b and r");
		
		// Restore l
		l.data[m-1] = l_old;	
		
		// Test infeasible upper bounds condition - sum b_i * u_i < r
		u.data[m-1] = (-(PortfolioAllocation.Matrix.vectorDotProduct(b, u) - b.data[m-1]*u.data[m-1]) + r - (1 - Math.random()))/b.data[m-1];
		assert.throws(function() { PortfolioAllocation.qksolveBS_(d, a, b, r, l, u) },
							       new Error('infeasible problem detected'),
								  "Infeasible problem - Upper bounds incompatible with b and r");
	}

	// Test feasible random problems
	// Reference: Krzysztof C. Kiwiel, Breakpoint searching algorithms for the continuous quadratic knapsack problem
	{
		var nbTests = 100;
		for (var k = 0; k < nbTests; ++k) {
			var n = generateRandomDimension(1, 100);
			var d = generateRandomStriclyPositiveVector(n);
			var a = generateRandomVector(n);
			var b = generateRandomStriclyPositiveVector(n);
			var bounds = generateRandomBounds(n, b);
			var l = bounds[0];
			var u = bounds[1];
			var r = bounds[2];
			
			var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });
			var x = sol[0];
			var f_x = sol[1];
			var t = sol[2];
			
			// Check that f_x corresponds to the value of the function f at point x
			var expected_f_x = 1/2 * PortfolioAllocation.Matrix.vectorDotProduct(x, PortfolioAllocation.Matrix.elementwiseProduct(x, d)) 
							   - PortfolioAllocation.Matrix.vectorDotProduct(a, x);
			assert.equal(Math.abs(f_x - expected_f_x) <= Math.abs(expected_f_x) * 1e-16, true, 'Feasible problem ' + (k+1) + ' - 1/3');
			
			// Check that x corresponds to the point x(t), using formula 2.1 of the reference.
			var x_t = PortfolioAllocation.Matrix.elementwiseProduct(PortfolioAllocation.Matrix.axpby(1, a, -t, b), d.elemMap(function(i,j,val) { return 1/val;}));
			for (var i = 0; i < n; ++i) {
				x_t.data[i] = Math.min(Math.max(l.data[i], x_t.data[i]), u.data[i]);
			}
			assert.equal(PortfolioAllocation.Matrix.areEqual(x, x_t, 1e-14), true, 'Feasible problem ' + (k+1) + ' - 2/3');
			
			// Check that the point x corresponds to the point x^* in which the function f attain its minimum,
			// which reduces to checking that <b/x> = r, since the previous check ensured that it exists t such that x = x(t).
			assert.equal(Math.abs(PortfolioAllocation.Matrix.vectorDotProduct(b, x) - r) <= Math.abs(r) * 1e-10, true, 'Feasible problem ' + (k+1) + ' - 3/3');
		}
	}
	
	// Tests with static data
	// Reference: Krzysztof C. Kiwiel, Breakpoint searching algorithms for the continuous quadratic knapsack problem
	// Exemple 9.1
	{
		var d = new PortfolioAllocation.Matrix([1, 1, 1]);
		var a = new PortfolioAllocation.Matrix([0, 0, 0]);
		var b = new PortfolioAllocation.Matrix([1, 1, 1]);
		var r = -1;
		var l = new PortfolioAllocation.Matrix([0, -1, -2]);
		var u = new PortfolioAllocation.Matrix([0, 0, 0]);
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });
		
		var expectedX = new PortfolioAllocation.Matrix([0, -0.5, -0.5 ]);
		var expectedMinVal = 0.25;
		var expectedLagrangeMultiplier = 0.5;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #1 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #1 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #1 - 3/3');
		
	}
	
	// Exemple 9.2
	{
		var d = new PortfolioAllocation.Matrix([1, 1, 1, 1, 1]);
		var a = new PortfolioAllocation.Matrix([1, 1, 0, 0, 0]);
		var b = new PortfolioAllocation.Matrix([1, 1, 1, 1, 1]);
		var r = 1;
		var l = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0]);
		var u = new PortfolioAllocation.Matrix([10, 10, 10, 10, 10]); // u = is actually not bounded, but 10 is sufficient
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });
		
		var expectedX = new PortfolioAllocation.Matrix([0.5, 0.5, 0, 0, 0]);
		var expectedMinVal =  -0.75;
		var expectedLagrangeMultiplier = 0.5;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #2 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #2 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #2 - 3/3');
	}
	
	// Exemple 9.3
	{
		var d = new PortfolioAllocation.Matrix([1, 1, 1]);
		var a = new PortfolioAllocation.Matrix([0, 0.1, 0.2]);
		var b = new PortfolioAllocation.Matrix([1, 1, 1]);
		var r = 1;
		var l = new PortfolioAllocation.Matrix([0, 0, 0]);
		var u = new PortfolioAllocation.Matrix([10, 10, 10]); // u = is actually not bounded, but 10 is sufficient
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });	

		var expectedX = new PortfolioAllocation.Matrix([ 0.2333333333333333, 0.3333333333333333, 0.43333333333333335 ]);
		var expectedMinVal = 0.05666666666666667;
		var expectedLagrangeMultiplier = -7/30;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #3 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #3 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #3 - 3/3');
	}
	
	// Exemple 9.4
	{
		var d = new PortfolioAllocation.Matrix([1, 1, 1]);
		var a = new PortfolioAllocation.Matrix([0, 0, 2]);
		var b = new PortfolioAllocation.Matrix([1, 1, 1]);
		var r = 1;
		var l = new PortfolioAllocation.Matrix([0, 0, 0]);
		var u = new PortfolioAllocation.Matrix([10, 10, 10]); // u = is actually not bounded, but 10 is sufficient
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });
		
		var expectedX = new PortfolioAllocation.Matrix([0, 0, 1]);
		var expectedMinVal = -1.5;
		var expectedLagrangeMultiplier = 1;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #4 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #4 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #4 - 3/3');
	}

	// Exemple 9.5
	{
		var d = new PortfolioAllocation.Matrix([1, 1]);
		var a = new PortfolioAllocation.Matrix([0, 0]);
		var b = new PortfolioAllocation.Matrix([1, 1]);
		var r = -2;
		var l = new PortfolioAllocation.Matrix([-2, -2]);
		var u = new PortfolioAllocation.Matrix([-1, 0]); 
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, { outputLagrangeMultiplier:true });
		
		var expectedX = new PortfolioAllocation.Matrix([-1, -1]);
		var expectedMinVal = 1;
		var expectedLagrangeMultiplier = 1;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #5 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #5 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #5 - 3/3');
	}
	
	// Exemple 9.6
	{
		var d = new PortfolioAllocation.Matrix([1]);
		var a = new PortfolioAllocation.Matrix([2]);
		var b = new PortfolioAllocation.Matrix([1]);
		var r = 1;
		var l = new PortfolioAllocation.Matrix([0]);
		var u = new PortfolioAllocation.Matrix([1]); 
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, {outputLagrangeMultiplier:true});
		
		var expectedX = new PortfolioAllocation.Matrix([1]);
		var expectedMinVal = -1.5;
		var expectedLagrangeMultiplier = 1; // the reference is wrong here: t^* = 3/2 would imply x(t) = 0.5 while the linear constraint is x = 1 !
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #6 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #6 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #6 - 3/3');
	}
	
	// Exemple 9.7
	{
		var d = new PortfolioAllocation.Matrix([1, 1, 1]);
		var a = new PortfolioAllocation.Matrix([0, -1, -2]);
		var b = new PortfolioAllocation.Matrix([1, 1, 1]);
		var r = 2;
		var l = new PortfolioAllocation.Matrix([0, 0, 0]);
		var u = new PortfolioAllocation.Matrix([3, 3, 3]); 
		
		var sol = PortfolioAllocation.qksolveBS_(d, a, b, r, l, u, {outputLagrangeMultiplier:true});

		var expectedX = new PortfolioAllocation.Matrix([1.5, 0.5, 0]);
		var expectedMinVal = 1.75;
		var expectedLagrangeMultiplier = -3/2;
		
		assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-16), true, 'Feasible #7 - 1/3');
		assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-16, true, 'Feasible #7 - 2/3');
		assert.equal(Math.abs(sol[2] - expectedLagrangeMultiplier) <= Math.abs(expectedLagrangeMultiplier) * 1e-14, true, 'Feasible #7 - 3/3');
	}
});


QUnit.test('Linear programming solver - Primal Dual Hybrid Gradient', function(assert) {    
  // Reference:  Vanderbei, Robert J, Linear Programming Foundations and Extensions 4th edition
  // Problem, p. 11
/*
  // Infeasible problem, p. 7
  {
	var A = new PortfolioAllocation.Matrix([[1, 1], [-2, -2]]);
	var b = new PortfolioAllocation.Matrix([2, -9]);
	var c = new PortfolioAllocation.Matrix([-5, -4]);

	assert.throws(function() { PortfolioAllocation.lpsolveAffineScaling_(A, b, c, {problemForm: 'standard'}) },
		                         new Error('infeasible problem detected'),
		                         "");
	
  }
  
  // Infeasible problem, p. 62
  {
	var A = new PortfolioAllocation.Matrix([[1, -1], [-1, 1]]);
	var b = new PortfolioAllocation.Matrix([1, -2]);
	var c = new PortfolioAllocation.Matrix([-2, 1]);
	
	assert.throws(function() { PortfolioAllocation.lpsolveAffineScaling_(A, b, c, {problemForm: 'standard'}) },
		                         new Error('infeasible problem detected'),
		                         "");
	
  }
  
  // Unbounded problem, p. 7
  {
	var A = new PortfolioAllocation.Matrix([[-2, 1], [-1, -2]]);
	var b = new PortfolioAllocation.Matrix([-1, -2]);
	var c = new PortfolioAllocation.Matrix([-1, 4]);
	
	assert.throws(function() { PortfolioAllocation.lpsolveAffineScaling_(A, b, c, {problemForm: 'standard'}) },
	                         new Error('unbounded problem detected'),
	                         "");
  }
*/

  // Reference:  Vanderbei, Robert J, Linear Programming Foundations and Extensions 4th edition
  // Problem, p. 11
 {
	var Ai = new PortfolioAllocation.Matrix([[2, 3, 1], [4, 1, 2], [3, 4, 2]]);
	var bi = new PortfolioAllocation.Matrix([5, 11, 8]);
	var c = new PortfolioAllocation.Matrix([-5, -4, -3]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(null, null, Ai, bi, c, null, null);

	var expectedX = new PortfolioAllocation.Matrix([2, 0, 1]);
	var expectedMinVal = -13;
	
	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-04), true, 'Feasible #1 - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'Feasible #1 - 2/2');
  }
  
  // Problem, p. 19
  {
	var Ai = new PortfolioAllocation.Matrix([[-1, 3], [1, 1], [2, -1]]);
	var bi = new PortfolioAllocation.Matrix([12, 8, 10]);
	var c = new PortfolioAllocation.Matrix([-3, -2]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(null, null, Ai, bi, c, null, null);
	
	var expectedX = new PortfolioAllocation.Matrix([6, 2]);
	var expectedMinVal = -22;

	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-04), true, 'Feasible #2 - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'Feasible #2 - 2/2');
  }
  
  // Reference: Dantzig George, Linear programming and extensions
  // Illustrative example 1, p. 108
  {
	var Ae = new PortfolioAllocation.Matrix([[5, -4, 13, -2, 1], [1, -1, 5, -1, 1]]);
	var be = new PortfolioAllocation.Matrix([20, 8]);
	var c = new PortfolioAllocation.Matrix([1, 6, -7, 1, 5]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(Ae, be, null, null, c, null, null);
	
	var expectedX = new PortfolioAllocation.Matrix([0, 4/7, 12/7, 0, 0]);
	var expectedMinVal = -60/7;

	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-04), true, 'Feasible #3 - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'Feasible #3 - 2/2');
  }
  
  // Illustrative example 1, p. 110
  {
	var Ae = new PortfolioAllocation.Matrix([[-1, -1, -1, -1, -1, -1, -1, -1,-1], 
											[-0.1, -0.1, -0.4, -0.6, -0.3, -0.3, -0.3, -0.5, -0.2], 
											[-0.1, -0.3, -0.5, -0.3, -0.3, -0.4, -0.2, -0.4, -0.3], 
											[-0.8, -0.6, -0.1, -0.1, -0.4, -0.3, -0.5, -0.1, -0.5]]);
	var be = new PortfolioAllocation.Matrix([-1, -0.3, -0.3, -0.4]);
	var c = new PortfolioAllocation.Matrix([4.1, 4.3, 5.8, 6.0, 7.6, 7.5, 7.3, 6.9, 7.3]);
	 
	var sol = PortfolioAllocation.lpsolvePDHG_(Ae, be, null, null, c, null, null);
	
	var expectedX = new PortfolioAllocation.Matrix([0, 0.6, 0, 0.4, 0, 0, 0, 0, 0]);
	var expectedMinVal = 4.98;
	
	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-04), true, 'Feasible #4 - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'Feasible #4 - 2/2');
  }
 
  // Reference: https://math.stackexchange.com/questions/59429/berlin-airlift-linear-optimization-problem
  // Note: with 9000 and 5000 as 3rd constrains instead of 9 and 5, and with the associated limit 300 000 instead of 300, 
  // the A matrix and the b vector are badly scaled (ex. for b - min value: 44, max value 300 000), which slows down the algorithm.
  {
	var Ai = new PortfolioAllocation.Matrix([[1, 1], 
											[16, 8], 
											[9, 5]]); 
	var bi = new PortfolioAllocation.Matrix([44, 512, 300]);
	var c = new PortfolioAllocation.Matrix([-30000, -20000]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(null, null, Ai, bi, c, null, null);
	
	var expectedX = new PortfolioAllocation.Matrix([20, 24]);
	var expectedMinVal = -1080000;

	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-03), true, 'Feasible #5 - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-05, true, 'Feasible #5 - 2/2');
  }
  
  // Reference: http://www.numerical.rl.ac.uk/cute/netlib.html, AFIRO problem
  {
	var Ae = new PortfolioAllocation.Matrix([[-1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
											  [-1.06, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
											  [0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, -1.06, -1.06, -0.96, -0.86, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.43, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.43, -0.43, -0.39, -0.37, 0, 0, 0, 0, 0, 0, 1, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, -1, 1, 0, 1]]);
	var be = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0, 0, 0, 44]);
	var Ai = new PortfolioAllocation.Matrix([[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.4, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 2.364, 2.386, 2.408, 2.429, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 2.191, 2.219, 2.249, 2.279, 0, 0, 0, 0],
											  [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0.109, 0.108, 0.108, 0.107, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0.301, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0.301, 0.313, 0.313, 0.326, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
											  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
											  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]]); 
	var bi = new PortfolioAllocation.Matrix([80, 0, 80, 0, 0, 0, 500, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 310, 300]);
	var c = new PortfolioAllocation.Matrix([0, -0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.32, 0, 0, 0, -0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.48, 0, 0, 10]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(Ae, be, Ai, bi, c, null, null);
	
	var expectedMinVal = -4.6475314286e02; // Direclty from Netlib README file

	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'AFIRO');
  }
  
  // Reference: http://www.numerical.rl.ac.uk/cute/netlib.html, SC50B problem
  {	
	var Ae = new PortfolioAllocation.Matrix([[0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,1.1000000000000001,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1000000000000001,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1000000000000001,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1000000000000001,0,0,0,0,0,0,0,0,0,0,-1]]);
	var be = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	var Ai = new PortfolioAllocation.Matrix([[3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 2 null rows here
											[0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,-1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0.40000000000000002,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0.59999999999999998,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.40000000000000002,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.59999999999999998,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.40000000000000002,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.59999999999999998,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,1,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,3,3,3,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.40000000000000002,0,0,0,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.59999999999999998,0,0,0,0,0,-1,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.69999999999999996,0.29999999999999999,0.29999999999999999,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0.40000000000000002],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0.59999999999999998]]);
	var bi = new PortfolioAllocation.Matrix([300, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0]);  // 2 null rows at indexes 2 and 3
	var c = new PortfolioAllocation.Matrix([0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(Ae, be, Ai, bi, c, null, null);
	
	var expectedMinVal = -7.0000000000e01; // Direclty from Netlib README file

	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-06, true, 'SC50B');
  }
  
  // Reference: Christos Papahristodoulou, Optimal portfolios using Linear Programming models (preliminary version on Internet)
  // (b) Maximin formulation example
  {
	var Ai = new PortfolioAllocation.Matrix([[1, 1, 1, 1, 1, 0], // budget constraint
											 [-0.054, -0.032, -0.064, -0.038, -0.049, 1], // January return
 											 [-0.045, -0.055, -0.056, -0.062, -0.067, 1], // ..
 											 [0.03, 0.036, -0.048, 0.037, 0.039, 1],
											 [0.018, -0.052, -0.007, -0.05, -0.051, 1],
											 [-0.043, -0.047, -0.053, -0.065, -0.049, 1],
											 [-0.047, -0.034, -0.036, 0.043, -0.037, 1],
											 [-0.055, -0.063, -0.017, -0.062, -0.055, 1],
											 [-0.036, -0.048, -0.047, -0.034, -0.025, 1],
											 [0.039, -0.025, 0.059, -0.035, -0.052, 1],
											 [0.043, -0.04, -0.047, -0.056, -0.02, 1],
											 [-0.046, -0.036, -0.04, -0.057, -0.045, 1],
											 [-0.052, 0.017, -0.032, -0.025, -0.04, 1], // December return
											 [-0.020, -0.0316, -0.0323, -0.0337, -0.0376, 0]]); // return demand constraint
	var bi = new PortfolioAllocation.Matrix([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.03]);
	var c = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0, -1]);
	var ub = new PortfolioAllocation.Matrix([0.75, 0.75, 0.75, 0.75, 0.75, Infinity]);
	var lb = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0, -Infinity]);
	
	var sol = PortfolioAllocation.lpsolvePDHG_(null, null, Ai, bi, c, lb, ub);

	var expectedX = new PortfolioAllocation.Matrix([0, 0, 0.459596, 0, 0.540404, 0.000985]);
	var expectedMinVal = -0.000985;

	assert.equal(PortfolioAllocation.Matrix.areEqual(sol[0], expectedX, 1e-03), true, 'Maximin - 1/2');
	assert.equal(Math.abs(sol[1] - expectedMinVal) <= Math.abs(expectedMinVal) * 1e-03, true, 'Maximin - 2/2');
  }


  // Reference: http://www.numerical.rl.ac.uk/cute/netlib.html, BOEING2 problem
  /*
  {
	var Ae = new PortfolioAllocation.Matrix([[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,2.32729,0,0,0,1000,0,0,0,25,0,0,0,0,0,0,0,0,0,0,0,1.34295,0,0,0,1.34295,0,0,0,0,0,3.12813,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,2.10966,0,0,0,2000,0,0,0,25,0,0,2.65943,0,1.25093,0,1.85313,0,2.30477,0,0,1.05384,0,0,0,1.05384,0,0,1.85313,0,0,2.58202,0,0,2.65943,0,3.11107,0,1.25093,0,2.05723,0,5.69309,0,5.24145,0,0.8063,0,0.8063,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2.10966,0,0,0,3000,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,1.05384,0,0,0,1.05384,0,0,0,0,0,2.58202,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2.10966,0,0,0,1500,0,0,0,27,0,2.65943,0,1.25093,0,1.85313,0,2.30477,0,0,0,1.05384,0,0,0,1.05384,0,1.85313,0,0,0,2.58202,0,2.65943,0,3.11107,0,1.25093,0,2.05723,0,5.69309,0,5.24145,0,0.8063,0,0.8063]]);
	var be = new PortfolioAllocation.Matrix([30,45,0,0]);
	var Ai = new PortfolioAllocation.Matrix([[-0.075,-0.075,-0.075,-0.075,-0.075,-0.027,-0.027,-0.027,-0.027,-0.053,-0.053,-0.053,-0.053,-0.075,-0.075,-0.075,-0.075,-0.075,-0.068,-0.068,-0.068,-0.068,-0.035,-0.035,-0.035,-0.035,-0.027,-0.027,-0.027,-0.027,-0.027,-0.027,-0.068,-0.068,-0.068,-0.068,-0.037,-0.037,-0.037,-0.053,-0.053,-0.053,-0.053,-0.053,-0.035,-0.035,-0.035,-0.035,-0.035,-0.037,-0.037,-0.037,-0.037,-0.75,-0.75,-0.53,-0.53,-0.75,-0.75,-0.75,-0.75,-0.75,-0.75,-0.53,-0.53,-0.53,-0.53,-0.75,-0.75,-0.75,-0.75,-0.75,-0.68,-0.68,-0.68,-0.68,-0.68,-0.68,-0.68,-0.68,-0.37,-0.37,-0.37,-0.37,-0.37,-0.37,-0.37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.65,0.05,-0.275,0.02889,0.03611,0.01333,-0.01,-0.02,-0.03,-0.04,-4.04337,-1.60964,-1.93119,-1.34618,-1.1,-1.2,-1.3,-2.34647,-2.36783,-1.90292,-1.36416,-1.14401,-1.64736,-1.33312,-2.55381,-2.14431,-3.12679,-1.18965,-1.42472,-1.0003,-3.12679,-1.18965,-1.42472,-1.0003,-1.64736,-1.33312,-7.17016,-2.79929,-3.35591,-2.34647,-2.36783,-1.90292,-3.27428,-2.71411,-1.36416,-1.14401,-2.08463,-1.71382,-6.07357,-5.06059,-5.16712,-4.24939,-0.72047,-0.5698,-0.72047,-0.5698],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7.98429,2.51914,3.15178,1.99337,5.83404,1.82258,2.27351,1.41795,9.91398,3.07692,3.83055,2.3665,3.16965,2.4431,1.49045,1.14359,2.21183,1.73951,2.7448,2.09214,4.07994,1.25435,1.55704,0.94855,4.07994,1.25435,1.55704,0.94855,2.21183,1.73951,9.91398,3.07692,3.83055,2.3665,3.16965,2.4431,3.70262,2.79573,1.49045,1.14359,2.44827,1.84718,6.77953,5.16223,6.24657,4.8096,0.95782,0.70359,0.95782,0.70359],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2,-2,-2,-2,-1,-1,-1,-1,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2,-2,-2,-2,-3,-3,-1,-1,-2,-2,-5,-5,-4,-4,-1,-1,-1,-1],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.86441,-0.86441,-0.86441,-0.86441,-0.56156,-0.56156,-0.56156,-0.56156,-0.87605,-0.87605,-0.87605,-0.87605,-0.91637,-0.91637,-0.41715,-0.41715,-0.7308,-0.7308,-0.73165,-0.73165,-0.3145,-0.3145,-0.3145,-0.3145,-0.3145,-0.3145,-0.3145,-0.3145,-0.7308,-0.7308,-0.87605,-0.87605,-0.87605,-0.87605,-0.91637,-0.91637,-0.91722,-0.91722,-0.41715,-0.41715,-0.60273,-0.60273,-1.79328,-1.79328,-1.79242,-1.79242,-0.18557,-0.18557,-0.18557,-0.18557],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-351.81396,-113.23743,0,0,-228.55299,-73.56374,0,0,-356.55371,-114.76299,0,0,-120.04449,0,-54.64705,0,-95.73444,0,-95.8463,0,-128.00075,-41.19926,0,0,-128.00075,-41.19926,0,0,-95.73444,0,-356.55371,-114.76299,0,0,-120.04449,0,-120.15637,0,-54.64705,0,-78.95706,0,-234.91937,0,-234.80756,0,-24.31007,0,-24.31007,0],
											[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[-0.86441,-0.87605,-0.91637,-0.91722,-0.87605,-0.18557,-0.18557,-1.60685,-0.18557,-0.56156,-0.56156,-0.60273,-0.56156,-0.87605,-0.91637,-0.91722,-0.87605,-0.91637,-0.7308,-0.7308,-0.73165,-0.7308,-0.3145,-0.3145,-0.3145,-0.3145,-0.18557,-0.18557,-0.18557,-1.6077,-0.18557,-0.18557,-0.7308,-0.7308,-0.73165,-0.73165,-0.41715,-0.41715,-0.41715,-0.56156,-0.60273,-0.60273,-0.56156,-1.23087,-0.3145,-0.3145,-0.3145,-0.3145,-0.3145,-0.41715,-0.41715,-0.41715,-1.0453,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0.86441,0.87605,0.91637,0.91722,0.87605,0.18557,0.18557,1.60685,0.18557,0.56156,0.56156,0.60273,0.56156,0.87605,0.91637,0.91722,0.87605,0.91637,0.7308,0.7308,0.73165,0.7308,0.3145,0.3145,0.3145,0.3145,0.18557,0.18557,0.18557,1.6077,0.18557,0.18557,0.7308,0.7308,0.73165,0.73165,0.41715,0.41715,0.41715,0.56156,0.60273,0.60273,0.56156,1.23087,0.3145,0.3145,0.3145,0.3145,0.3145,0.41715,0.41715,0.41715,1.0453,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-211.088376,-67.942458,0,0,-137.131794,-44.138244,0,0,-213.932226,-68.857794,0,0,-72.026694,0,-32.78823,0,-57.440664,0,-57.50778,0,-76.80045,-24.719556,0,0,-76.80045,-24.719556,0,0,-57.440664,0,-213.932226,-68.857794,0,0,-72.026694,0,-72.093822,0,-32.78823,0,-47.374236,0,-140.951622,0,-140.884536,0,-14.586042,0,-14.586042,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-25.93224,0,-34.57631,-12.96612,-16.84665,0,-22.4622,-8.42333,-26.2816,0,-35.04214,-13.1408,0,-13.74556,0,-6.25729,0,-10.96196,0,-10.97477,-9.43495,0,-12.57993,-4.71747,-9.43495,0,-12.57993,-4.71747,0,-10.96196,-26.2816,0,-35.04214,-13.1408,0,-13.74556,0,-13.75836,0,-6.25729,0,-9.04089,0,-26.89915,0,-26.88635,0,-2.7836,0,-2.7836],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.86441,-0.87605,-0.56156,-0.56156,-0.87605,-0.86441,-0.87605,-0.91637,-0.91722,-0.87605,-0.56156,-0.56156,-0.60273,-0.56156,-0.87605,-0.91637,-0.91722,-0.87605,-0.91637,-0.7308,-0.7308,-0.73165,-0.7308,-0.7308,-0.7308,-0.73165,-0.73165,-0.41715,-0.41715,-0.41715,-0.41715,-0.41715,-0.41715,-1.0453,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.86441,0.87605,0.56156,0.56156,0.87605,0.86441,0.87605,0.91637,0.91722,0.87605,0.56156,0.56156,0.60273,0.56156,0.87605,0.91637,0.91722,0.87605,0.91637,0.7308,0.7308,0.73165,0.7308,0.7308,0.7308,0.73165,0.73165,0.41715,0.41715,0.41715,0.41715,0.41715,0.41715,1.0453,0,0,0,0,0,0,-12.96612,0,-17.288155,-6.48306,-8.423325,0,-11.2311,-4.211665,-13.1408,0,-17.52107,-6.5704,0,-6.87278,0,-3.128645,0,-5.48098,0,-5.487385,-4.717475,0,-6.289965,-2.358735,-4.717475,0,-6.289965,-2.358735,0,-5.48098,-13.1408,0,-17.52107,-6.5704,0,-6.87278,0,-6.87918,0,-3.128645,0,-4.520445,0,-13.449575,0,-13.443175,0,-1.3918,0,-1.3918],
											[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
											// 2 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											// 2 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-305,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											// 2 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0,0,0],
											// 3 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0,0,0],
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0,0,0],
											// 2 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0,0,0],
											[0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0],
											[0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0],
											[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0,0,0],
											// 5 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0,0,0],
											[0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0],
											[0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0],
											[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0,0,0],
											// 4 rows removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0,0,0],
											[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0,0,0],
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-98,0],
											// 1 row removed, as null
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-11.25],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-2,-2,-2,-2,0,0,-1,-1,0,0,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-2,-2,-2,-2,0,0,-2,-2,-1,-1,-1,-1,-4,-4,-2,-2,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,-1,0,1,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,-1,0,1],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,-1,0,-1,0,0,0,-1,0,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,-1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,-1,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,-1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,-1],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,-1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0],
											[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,0,0,-1,-1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,-1,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,-1,0,-1,0,0,0,0,0,-1,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,-1,0,-1,0,0,0,0,0,0,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,-1,-1,0,0,0,0,-1,0,0,0,0,0,-1,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,-1,0,-1,0,-1,0,0,0,-1,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,-1,0,0,0,-1,0,-1,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,0,0,0,0,0,0,0,-1,0,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,-1,0,0,0,-1,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,0,-1,0,-1,0,0,0,0,0,-1,0,-1,0,0,0,0],
											[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0]]);
	var bi = new PortfolioAllocation.Matrix([0,0,100000,-50,0,0,-9431,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,
											 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
											 0,-24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,302,2352,142,302,515,619,2743,712,517,131,712,409,-3,-7,-1,-3,-4,-5,-7,-5,-4,-1,-6,-3,12,16,24,13,45,16,5,-1,-2]); // null values corresponding to removed rows in Ai removed
	var c = new PortfolioAllocation.Matrix([-0.075, -0.075, -0.075, -0.075, -0.075, -0.027, -0.027, -0.027, -0.027, -0.053, -0.053, -0.053, -0.053, -0.075, -0.075, -0.075, -0.075, -0.075, -0.068, -0.068, -0.068, -0.068, -0.035, -0.035, -0.035, -0.035, -0.027, -0.027, -0.027, -0.027, -0.027, -0.027, -0.068, -0.068, -0.068, -0.068, -0.037, -0.037, -0.037, -0.053, -0.053, -0.053, -0.053, -0.053, -0.035, -0.035, -0.035, -0.035, -0.035, -0.037, -0.037, -0.037, -0.037, -0.75, -0.75, -0.53, -0.53, -0.75, -0.75, -0.75, -0.75, -0.75, -0.75, -0.53, -0.53, -0.53, -0.53, -0.75, -0.75, -0.75, -0.75, -0.75, -0.68, -0.68, -0.68, -0.68, -0.68, -0.68, -0.68, -0.68, -0.37, -0.37, -0.37, -0.37, -0.37, -0.37, -0.37, 0.65, -0.05, 0.275, -0.02889, -0.03611, -0.01333, 0.01, 0.02, 0.03, 0.04, 4.04337, 1.60964, 1.93119, 1.34618, 1.1, 1.2, 1.3, 2.34647, 2.36783, 1.90292, 1.36416, 1.14401, 1.64736, 1.33312, 2.55381, 2.14431, 3.12679, 1.18965, 1.42472, 1.0003, 3.12679, 1.18965, 1.42472, 1.0003, 1.64736, 1.33312, 7.17016, 2.79929, 3.35591, 2.34647, 2.36783, 1.90292, 3.27428, 2.71411, 1.36416, 1.14401, 2.08463, 1.71382, 6.07357, 5.06059, 5.16712, 4.24939, 0.72047, 0.5698, 0.72047, 0.5698]);
    var ub = new PortfolioAllocation.Matrix([Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, 0, Infinity, 0, 0, 0, 7, 7, 2, 2, 7, 7, 2, 2, 7, 7, 2, 2, 14, 2, 7, 2, 7, 2, 7, 2, 7, 7, 2, 2, 7, 7, 2, 2, 7, 2, 7, 7, 2, 2, 14, 2, 14, 2, 7, 2, 14, 2, 7, 7, 7, 7, 14, 7, 14, 7]);
	var lb = new PortfolioAllocation.Matrix([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -100, 0, -90, -45, -45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

	var sol = PortfolioAllocation.lpsolvePDHG_(Ae, be, Ai, bi, c, lb, ub, {maxIter: 10000});
  }*/
});

