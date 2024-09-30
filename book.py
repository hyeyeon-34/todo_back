import pandas as pd
import os
import sys
import openai
import io 
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
# CSV 파일 로드
df = pd.read_csv('books1000.csv')

def textual_representation(row):
    return f"""Title : {row['title']}
    Authors: {row['authors']}
    Description: {row['description']}
    Categories: {row['categories']}
    Publishing Year: {row['published_year']}
    Average Rating: {row['average_rating']}
    Number of Pages: {row['num_pages']}
    """

# DataFrame의 텍스트 표현 추가
df['textual_representation'] = df.apply(textual_representation, axis=1)

# OpenAI API 키 설정
# os.getenv("OPENAI_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")
# # OpenAI 클라이언트 초기화
# openai.api_key = os.environ["OPENAI_API_KEY"]
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
# Document 클래스 정의
class CustomDocument(Document):
    def __init__(self, page_content, metadata=None):
        super().__init__(page_content=page_content, metadata=metadata)

# Document 객체로 변환
documents = [CustomDocument(text, metadata={"index": i}) for i, text in enumerate(df['textual_representation'])]

# 텍스트 분할기 설정
# text_splitter = RecursiveCharacterTextSplitter()


# # 문서 분할
# texts = text_splitter.split_documents(documents)




# OpenAIEmbeddings 인스턴스를 생성합니다.
embedding = OpenAIEmbeddings()

# Chroma 벡터 DB에 분할된 문서와 임베딩을 추가합니다.

vectordb = Chroma.from_documents(documents=documents, embedding=embedding)
# vectordb = Chroma.from_documents(documents=text, embedding=embedding)

# 벡터 DB에서 retriever 생성
retriever = vectordb.as_retriever()

# 검색어를 통해 관련된 문서를 가져옵니다 (Author 기반)
query = sys.argv[1] if len(sys.argv) > 1 else ""
# docs = retriever.invoke(query)

docs = retriever.invoke(query) 
# docs = vectordb.similarity_search(query) 
# for doc in texts:
#     if "Laura Ingalls Wilder" in doc.page_content:
#         print("Found in document:", doc.page_content)
# 검색된 문서의 개수 출력
# print(f"유사도 높은 텍스트 개수: {len(docs)}")
# print("-" * 50)

# 첫 번째 유사도 높은 텍스트 출력
if len(docs) > 0:
    print(f"유사도 높은 텍스트 중 첫번째 텍스트 출력: {docs[0].page_content}")
    print("-" * 50)
else:
    print("유사한 책을 찾지 못했습니다.")


# print(f"Documents: {texts}")
# print(f"Embedding: {embedding}")
# print(f"Embedding initialized: {embedding}")