import numpy
import operator
import dataParse
import onlineldavb

def distance(document1, document2):
	sim = sum(pow(document1-document2,2))
	return sim


#Returns a distance-base similarity score for document1 and document2
def similarity(testgamma):
    f=open("../../data/LDAResult/b_similarity2.dat","w+")
    similarity_matrix = dict()
    row=1
    for i in testgamma:
        col=1
        temp = dict()
        for j in testgamma[:-1]:
            temp[col]=distance(i,j)
            #f.write(str(temp[col])+",") #Save in csv format
            f.write(str(temp[col])+" ") #Save in txt format
            col=col+1
        temp[col]=distance(i,testgamma[-1])
        similarity_matrix[row]=temp
        f.write(str(temp[col]))
        f.write('\n')
        row=row+1
    f.close()
    return similarity_matrix


#Recommend a similar document based on similarity score
#For different input data, use recommend command respectively
#recommend2 already has a label, where recommend needs to use zip to get a label
def recommend(document_id,similarity_matrix):
    sim = similarity_matrix[document_id]
    temp = zip(sim, range(0, len(sim)))
    rank = sorted(temp, key = lambda x: x[0])
    return [rank[0][0],rank[1][0],rank[2][0],rank[3][0],rank[4][0]]


def recommend2(document_id,similarity_matrix):
    sim = similarity_matrix[document_id]
    rank = sorted(sim.items(),key=operator.itemgetter(1))
    return [rank[0][1],rank[1][1],rank[2][1],rank[3][1],rank[4][1]]


def main():
    #Combine all the gamma into one(need to run once if not)
    '''
    fi=open("../../data/LDAResult/allgamma.dat","w+")
    iteration = 50
    batch = 100
    for i in range(0,iteration):
        f = open("../../data/LDAResult/gamma-"+str(i)+".dat")
        for j in range(0,batch):
            gamma = f.readline()
            fi.write(gamma)
        f.close()
    fi.close()
    '''


    #read allgamma from txt or csv file
    testgamma = numpy.loadtxt(file("../../data/LDAResult/allgamma.dat"))
    #testgamma = numpy.genfromtxt(file("../../data/LDAResult/allgamma.dat"),delimiter=',')
    gamma_size = len(testgamma)
    #Normalize data
    for k in range(0, gamma_size):
        temp_gamma = list(testgamma[k, :])
        testgamma[k] = temp_gamma / sum(temp_gamma)


    sim_matrix = similarity(testgamma)
    #If similarity has been already generated, read it directly.
    #sim_matrix =  numpy.genfromtxt(file("../../data/LDAResult/b_similarity.dat"),delimiter=',')


    #To test result
    '''
    dp=dataParse.dataParse("../../data/ideas.txt")
    des=dp.concatedField("../../data/fieldList.txt")
    #Type the document ID to find its recommendations
    document_id = 96

    r_id = recommend2(document_id,sim_matrix)
    print r_id
    print des[document_id]

    print des[r_id]
    '''


if __name__ == '__main__':
    main()
