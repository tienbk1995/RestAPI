import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";

  import { Post } from "./post";
  import { Comment } from "./comment";

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    firstName!: string;
  
    @Column()
    lastName!: string;
  
    @Column()
    email!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany((_type) => Post, (post: Post) => post.user)
    posts!: Array<Post>;
  
    @OneToMany((_type) => Comment, (comment: Comment) => comment.user)
    comments!: Array<Comment>;
  }