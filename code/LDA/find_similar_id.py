import dataParse
import numpy

def find_type(document_id,search_id,dp):
    type_of_innovation=dp.fieldParse("type_of_innovation")
    similar_id = []

    if type_of_innovation[document_id] == "None":
        return search_id

    j = 0
    for si in search_id:
        if type_of_innovation[si] == type_of_innovation[document_id]:
            similar_id.append(search_id[j])
        j = j+1

    return similar_id


def find_tag(document_id,search_id):
    f = open("../../data/Other/tag_set.txt")
    tagset = f.readline().split()
    tag_distribution = []
    for item in range(0,len(tagset)):
        tag_distribution.append(f.readline().split())
    f.close()

    #Read tags in id-th document
    line = open("../../data/document/tag"+str(document_id)+".txt").readline()
    l = line.replace(',',' ')
    tags_in_search = l.split(' ')
    if tags_in_search == ['na']:
        return search_id


    #Get the id of these tags in the whole tag set
    temp_id = []
    for word in tags_in_search:
        i = 0
        for tag in tagset:
            if word == tag:
                temp_id.append(i)
            i = i+1
    similar_id = set()
    for i in temp_id:
        for j in tag_distribution[i]:
            if int(j) in search_id:
                similar_id.add(int(j))

    return similar_id


def recommend(document_id,similarity_matrix,search_id):
    sim = similarity_matrix[document_id][search_id]
    print similarity_matrix[document_id]
    temp = zip(sim, search_id)
    rank = sorted(temp, key = lambda x: x[0])
    #5 is the number of the recommendations shown up
    if len(rank) > 4:
        print rank[0][0]
        print rank[1][0]
        print rank[2][0]
        print rank[3][0]

        return [rank[0][1],rank[1][1],rank[2][1],rank[3][1],rank[4][1]]
    else:
        similar_id =[]
        for i in rank:
            similar_id.append(i[1])
        return similar_id


def find_similar(document_id,search_id):
    #sim_matrix =  numpy.genfromtxt(file("../../data/LDAResult/b_similarity.dat"),delimiter=',')
    sim_matrix = numpy.loadtxt(file("../../data/LDAResult/b_similarity2.dat"))
    r_id = recommend(document_id,sim_matrix,search_id)

    return r_id


def main():

    dp=dataParse.dataParse("../../data/ideas.txt")

    number_of_documents = 5000
    document_id = 4097
    search_id = range(4000,4200)
    search_id1 = find_type(document_id,search_id,dp)
    print search_id1

    search_id2 = list(find_tag(document_id,search_id1))
    print search_id2


    similar_id = find_similar(document_id,search_id2)
    print similar_id+1

if __name__ == '__main__':
    main()
