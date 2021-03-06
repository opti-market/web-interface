
// https://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript

export default function levDist(s, t) {
  var d: any = []; //2d matrix

  // Step 1
  var n: any  = s.length;
  var m: any  = t.length;

  if (n == 0) return m;
  if (m == 0) return n;

  //Create an array of arrays in javascript (a descending loop is quicker)
  for (var i: any  = n; i >= 0; i--) d[i] = [];

  // Step 2
  for (var i: any  = n; i >= 0; i--) d[i][0] = i;
  for (var j: any  = m; j >= 0; j--) d[0][j] = j;

  // Step 3
  for (var i: any = 1; i <= n; i++) {
      var s_i: any = s.charAt(i - 1);

      // Step 4
      for (var j: any = 1; j <= m; j++) {

          //Check the jagged ld total so far
          if (i == j && d[i][j] > 4) return n;

          var t_j: any = t.charAt(j - 1);
          var cost: any = (s_i == t_j) ? 0 : 1; // Step 5

          //Calculate the minimum
          var mi: any  = d[i - 1][j] + 1;
          var b: any  = d[i][j - 1] + 1;
          var c: any  = d[i - 1][j - 1] + cost;

          if (b < mi) mi = b;
          if (c < mi) mi = c;

          d[i][j] = mi; // Step 6

          //Damerau transposition
          if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
              d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
          }
      }
  }

  // Step 7
  return d[n][m];
}
