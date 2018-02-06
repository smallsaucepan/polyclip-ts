const compareEvents = require('./compare-events')
const { arePointsColinear, arePointsEqual } = require('./point')

module.exports = function compareSegments (le1, le2) {
  if (le1 === le2) return 0

  const pts = [le1.point, le1.otherEvent.point, le2.point, le2.otherEvent.point]

  if (!arePointsColinear(...pts)) {
    // If they share their left endpoint use the right endpoint to sort
    if (arePointsEqual(le1.point, le2.point)) {
      return le1.isBelow(le2.otherEvent.point) ? -1 : 1
    }

    // Different left endpoint: use the left endpoint to sort
    if (le1.point[0] === le2.point[0]) {
      return le1.point[1] < le2.point[1] ? -1 : 1
    }

    // has the line segment associated to e1 been inserted
    // into S after the line segment associated to e2 ?
    if (compareEvents(le1, le2) === 1) return le2.isAbove(le1.point) ? -1 : 1

    // The line segment associated to e2 has been inserted
    // into S after the line segment associated to e1
    return le1.isBelow(le2.point) ? -1 : 1
  }

  if (le1.isSubject === le2.isSubject) {
    // same polygon
    if (arePointsEqual(le1.point, le2.point)) {
      if (arePointsEqual(le1.otherEvent.point, le2.otherEvent.point)) return 0
      else return le1.contourId > le2.contourId ? 1 : -1
    }
  } else {
    // Segments are collinear, but belong to separate polygons
    return le1.isSubject ? -1 : 1
  }

  return compareEvents(le1, le2) === 1 ? 1 : -1
}
