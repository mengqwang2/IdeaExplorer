import dataParse
import numpy

def clean_word(word):
    PUNCTUATION = ['(', ')', ':', ';', ',', '-', '!', '.', '?', '/', '"', '*','#','_']
    word = word.lower()
    for punc in PUNCTUATION:
        word = word.replace(punc, ' ')
    return word


def main():

    dp=dataParse.dataParse("../../data/ideas.txt")

    number_of_documents = 5000

    all_tags=dp.fieldParse("tags")

    f2 = open("../../data/other/tag.txt","w+")
    for ele in all_tags:
        if ele == '':
            ele = 'na'
        word = unicode(ele).encode('utf-8')
        word = clean_word(word)
        f2.write(word+'\n')
    f2.close()


    #Create a set for tags
    tagset = set()
    f = open("../../data/other/tag.txt")
    f3 = open("../../data/other/tag_set.txt",'w')
    for i in range(0,number_of_documents):
        li = f.readline().replace(',',' ')
        word = li.split()
        for item in word:
            tagset.add(item)
    for item in tagset:
        f3.write(item+" ")
    f3.write("\n")
    tag_contain_doc_set = numpy.empty((len(tagset), 0)).tolist()

    f = open("../../data/other/tag.txt")
    for i in range(0,number_of_documents):
        li = f.readline().replace(',',' ')
        word = li.split()
        for tag1 in word:
            j = 0
            for tag2 in tagset:
                if tag1 == tag2:
                    tag_contain_doc_set[j].append(i)
                j = j+1


    for i in tag_contain_doc_set:
        for j in i:
            f3.write(str(j)+" ")
        f3.write('\n')

    f.close()

    f3.close()
if __name__ == '__main__':
    main()
