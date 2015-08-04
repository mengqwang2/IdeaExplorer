#!/usr/bin/python

# printtopics.py: Prints the words that are most prominent in a set of
# topics.
#
# Copyright (C) 2010  Matthew D. Hoffman
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import sys, os, re, random, math, urllib2, time, cPickle
import numpy

import onlineldavb

def main():
    """
    Displays topics fit by onlineldavb.py. The first column gives the
    (expected) most prominent words in the topics, the second column
    gives their (expected) relative prominence.
    """
    #vocab = str.split(file(sys.argv[1]).read())
    topicN = sys.argv[1]

    topiclist=range(0,int(topicN))
    #print topiclist

    testgamma = numpy.loadtxt(sys.argv[2])

    for k in range(0, len(testgamma)):
        gammak = list(testgamma[k, :])
        gammak = gammak / sum(gammak)
        temp = zip(gammak, range(0, len(gammak)))
        #print len(temp)
        temp = sorted(temp, key = lambda x: x[0], reverse=True)
        print 'Document %d:' % (k)
        # feel free to change the "53" here to whatever fits your screen nicely.
        for i in range(0, 1):
            print '%20s  \t---\t  %.4f' % (topiclist[temp[i][1]], temp[i][0])
        print

if __name__ == '__main__':
    main()