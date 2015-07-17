import numpy
import operator

def find_type(document_id,search_id):
    f = open("../../data/other/type.txt")
    similar_id = []
    l = f.readline().replace(',',' ')
    type_of_innovation = l.split()
    f.close()

    j = 0
    for si in search_id:
        if  type_of_innovation[si] == type_of_innovation[document_id]:
            similar_id.append(search_id[j])
        j = j+1
    return similar_id

def find_tag(document_id,search_id):
    #Create a set for tags
    tag_set = set()
    f = open("../../data/other/tag.txt")
    li = f.readline().replace(',',' ')
    word = li.split()
    for item in word:
        item.lower()
        tag_set.add(item)
    f.close()

    #Read tags in id-th document
    line = open("../../data/document/tag"+str(document_id)+".txt").readline()
    l = line.replace(',',' ')
    tags_in_search = l.split(' ')

    #Get the id of these tags in the whole tag set
    tag_id = []
    for tag in tags_in_search:
        tag = tag.lower()
        j = 0
        for i in tag_set:
            if i == tag:
                tag_id.append(j)
            j = j+1

    #Create the document ids set for each tag
    tag_belongings_set = []

    for tag in tag_set:
        temp = set()
        for k in search_id:
            line = open("../../data/document/tag"+str(k)+".txt").readline()
            l = line.replace(',',' ')
            tags = l.split(' ')
            for tag_compare in tags:
                if tag_compare == tag:
                    temp.add(k)
        tag_belongings_set.append(temp)

    #Get docuemnt_id which share with the same tags
    similar_id = set()
    for id in tag_id:
        for i in tag_belongings_set[id]:
            similar_id.add(i)
    return similar_id


def recommend(document_id,similarity_matrix,search_id):
    sim = similarity_matrix[document_id][search_id]
    temp = zip(sim, search_id)
    rank = sorted(temp, key = lambda x: x[0])
    return [rank[0][1],rank[1][1],rank[2][1],rank[3][1],rank[4][1]]


def find_similar(document_id,search_id):
    testgamma = numpy.loadtxt(file("../../data/LDAResult/allgamma.dat"))
    gamma_size = len(testgamma)
    #Normalize data
    for k in range(0, gamma_size):
        temp_gamma = list(testgamma[k, :])
        testgamma[k] = temp_gamma / sum(temp_gamma)

    #sim_matrix =  numpy.genfromtxt(file("../../data/LDAResult/b_similarity.dat"),delimiter=',')
    sim_matrix = numpy.loadtxt(file("../../data/LDAResult/b_similarity2.dat"))
    r_id = recommend(document_id,sim_matrix,search_id)

    return r_id


def main():
    number_of_documents = 5000
    document_id = 10
    search_id = range(0,number_of_documents)
    search_id1 = find_type(document_id,search_id)
    print search_id1
    search_id2 = list(find_tag(document_id,search_id1))
    print search_id2
    similar_id = find_similar(document_id,search_id2)
    print similar_id


if __name__ == '__main__':
    main()
