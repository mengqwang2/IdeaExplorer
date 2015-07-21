import dataParse
import numpy


def find_through_tag(key_word):
    temp_id = []

    f = open("../../data/Other/tag_set.txt")
    tagset = f.readline().split()

    for word in key_word:
        i = 0
        for tag in tagset:
            if word == tag:
                temp_id.append(i)
            i = i+1

    tag_distribution = []
    for item in range(0,len(tagset)):
        tag_distribution.append(f.readline().split())

    document_id = set()
    for i in temp_id:
        for j in tag_distribution[i]:
            document_id.add(j)
    f.close()
    return document_id


def find_through_word(key_word,vocab,testlambda):
    word_set = []
    #j is word id
    j = 0
    for word in vocab:
        if (key_word[0]+'\n') == word:
            word_set.append(j)
        j = j+1

    for word_id in word_set:
        temp = testlambda[:,word_id]
        temp = zip(temp, range(0,len(temp)))
        rank = sorted(temp, key = lambda x: x[0],reverse=True)
        return [rank[0][1],rank[1][1]]


def find_document(topic_set,testgamma):
    document_id = set()
    for topic_id in topic_set:
        temp = testgamma[:,topic_id]
        temp = zip(temp, range(0,len(temp)))
        rank = sorted(temp, key = lambda x: x[0],reverse=True)
        document_id.add(rank[0][1])
        document_id.add(rank[1][1])
    return document_id


def main():

    dp=dataParse.dataParse("../../data/ideas.txt")

    vocab = file('vocabulary_m.txt').readlines()

    key_word = ["platform"]

    testlambda = numpy.loadtxt(file("../../data/LDAResult/lambda-10.dat"))

    testgamma = numpy.loadtxt(file("../../data/LDAResult/gamma-10.dat"))

    topic_id = find_through_word(key_word,vocab,testlambda)
    print topic_id
    document_id = find_document(topic_id,testgamma)
    print document_id


    d = find_through_tag(key_word)
    print d
if __name__ == '__main__':
    main()
