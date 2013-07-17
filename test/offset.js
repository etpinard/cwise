var cwise = require("../cwise.js")
  , ndarray = require("ndarray")
  , test = require("tap").test

function DumbStorage(n) {
  this.data = new Int32Array(n)
  this.length = n
}
DumbStorage.prototype.get = function(i) { return this.data[i] }
DumbStorage.prototype.set = function(i, v) { return this.data[i]=v }


test("offset", function(t) {

  var binary = cwise({
    args: ["array", "array", {offset:[1], array:1}, "scalar", "shape", "index"],
    body: function(a,b,c,t,s,idx) {
      t.equals(a, 0, "idx:"+idx+", shape:"+s)
      a = c + b + 1000
    }
  })
  
  function testBinary1D(P, Q) {
    console.log(P.shape.toString(), Q.shape.toString())
    for(var i=0; i<P.shape[0]; ++i) {
      Q.set(i, i)
      P.set(i, 0)
    }
    Q.set(P.shape[0], P.shape[0])
    binary(P, Q, t)
    for(var i=0; i<P.shape[0]; ++i) {
      t.equals(P.get(i), 2*i+1001)
    }
  }
  
  var A = ndarray(new Int32Array(128))
  var B = ndarray(new Int32Array(129))
  
  testBinary1D(ndarray(new Int32Array(0)), ndarray(new Int32Array(1)))
  testBinary1D(ndarray(new Int32Array(1)), ndarray(new Int32Array(2)))
  testBinary1D(A, B)
  testBinary1D(A.lo(32), B)
  testBinary1D(A.step(-1), B)
  testBinary1D(A, B.step(-1))
  
  A = ndarray(new DumbStorage(128))
  B = ndarray(new DumbStorage(129))
  testBinary1D(ndarray(new DumbStorage(0)), ndarray(new DumbStorage(1)))
  testBinary1D(ndarray(new DumbStorage(1)), ndarray(new DumbStorage(2)))
  testBinary1D(A, B)
  testBinary1D(A.lo(32), B)
  testBinary1D(A.step(-1), B)
  testBinary1D(A, B.step(-1))
  
  t.end()
})
