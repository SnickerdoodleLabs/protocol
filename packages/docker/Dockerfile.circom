FROM rust:latest

RUN apt update \
    && apt install -y git \
                      curl \
                      vim \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt install -y nodejs \
    && npm install --global yarn

WORKDIR /root

RUN git clone https://github.com/iden3/circom.git
RUN git clone https://github.com/iden3/circomlib.git

WORKDIR /root/circom

RUN cargo build --release \
    && cargo install --path circom \
    && npm install -g snarkjs circomlib @zk-kit/circuits \
    && mkdir /root/circuits

WORKDIR /root/circuits

# COPY 
ENV CIRCUIT=semaphore
CMD circom /root/circuits/${CIRCUIT}.circom --r1cs --wasm --sym -o /root/circuits -l /usr/lib/node_modules/circomlib/circuits -l /usr/lib/node_modules/@zk-kit/circuits/circom